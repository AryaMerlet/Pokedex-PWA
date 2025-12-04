import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPokemons,
  fetchPokedex,
  catchPokemon,
  releasePokemon
} from '../api/queries';
import { queueOperation } from '../lib/offlineDb';

/**
 * Hook to fetch all available pokemons
 * Automatically handles caching and offline support
 */
export function usePokemons() {
  return useQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    staleTime: 1000 * 60 * 60, // Consider fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    networkMode: 'offlineFirst',
    retry: 3,
  });
}

/**
 * Hook to fetch user's pokedex (caught pokemons)
 * Requires userId parameter
 */
export function usePokedex(userId) {
  return useQuery({
    queryKey: ['pokedex', userId],
    queryFn: () => fetchPokedex(userId),
    enabled: !!userId, // Only run query if userId exists
    staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    networkMode: 'offlineFirst',
    retry: 3,
  });
}

/**
 * Hook to catch a pokemon (add to pokedex)
 * Handles offline queueing automatically
 */
export function useCatchPokemon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: catchPokemon,
    networkMode: 'offlineFirst',

    // Optimistic update
    onMutate: async (newEntry) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pokedex', newEntry.userId] });

      // Snapshot previous value
      const previousPokedex = queryClient.getQueryData(['pokedex', newEntry.userId]);

      // Optimistically update cache
      queryClient.setQueryData(['pokedex', newEntry.userId], (old) => {
        if (!old) return old;
        return [
          {
            id: `temp-${Date.now()}`,
            user_id: newEntry.userId,
            pokemon_id: newEntry.pokemonId,
            nickname: newEntry.nickname,
            caught_at: new Date().toISOString(),
            pokemons: {} // Will be filled by refetch
          },
          ...old
        ];
      });

      return { previousPokedex };
    },

    // On error, rollback
    onError: (err, newEntry, context) => {
      if (context?.previousPokedex) {
        queryClient.setQueryData(
          ['pokedex', newEntry.userId],
          context.previousPokedex
        );
      }

      // Queue for retry when back online
      queueOperation('catch_pokemon', newEntry);
      console.error('Failed to catch pokemon, queued for retry:', err);
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pokedex', variables.userId] });
    },

    onSuccess: () => {
      console.log('Pokemon caught successfully!');
    }
  });
}

/**
 * Hook to release a pokemon (remove from pokedex)
 * Handles offline queueing automatically
 */
export function useReleasePokemon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: releasePokemon,
    networkMode: 'offlineFirst',

    // Optimistic update
    onMutate: async (entryId) => {
      // Find which user's pokedex this belongs to
      const queries = queryClient.getQueriesData({ queryKey: ['pokedex'] });

      for (const [queryKey, data] of queries) {
        if (!data) continue;

        const entry = data.find(e => e.id === entryId);
        if (entry) {
          const userId = entry.user_id;

          // Cancel outgoing refetches
          await queryClient.cancelQueries({ queryKey: ['pokedex', userId] });

          // Snapshot previous value
          const previousPokedex = queryClient.getQueryData(['pokedex', userId]);

          // Optimistically update cache
          queryClient.setQueryData(['pokedex', userId], (old) => {
            if (!old) return old;
            return old.filter(e => e.id !== entryId);
          });

          return { previousPokedex, userId };
        }
      }

      return {};
    },

    // On error, rollback
    onError: (err, entryId, context) => {
      if (context?.previousPokedex && context?.userId) {
        queryClient.setQueryData(
          ['pokedex', context.userId],
          context.previousPokedex
        );
      }

      // Queue for retry when back online
      queueOperation('release_pokemon', { entryId });
      console.error('Failed to release pokemon, queued for retry:', err);
    },

    // Always refetch after success or error
    onSettled: (data, error, variables, context) => {
      if (context?.userId) {
        queryClient.invalidateQueries({ queryKey: ['pokedex', context.userId] });
      }
    },

    onSuccess: () => {
      console.log('Pokemon released successfully!');
    }
  });
}
