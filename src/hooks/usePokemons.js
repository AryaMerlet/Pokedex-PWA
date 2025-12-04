import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPokemons,
  getUserPokedex,
  addPokemonToPokedex,
  removePokemonFromPokedex,
  isPokemonInPokedex
} from '../utils/pokedex';
import { queueOperation } from '../lib/offlineDb';

/**
 * Hook to fetch all available pokemons
 * Automatically handles caching and offline support
 */
export function usePokemons() {
  return useQuery({
    queryKey: ['pokemons'],
    queryFn: getPokemons,
    staleTime: 1000 * 60 * 60, // Consider fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    networkMode: 'offlineFirst',
    retry: 3,
  });
}

/**
 * Hook to fetch user's pokedex (caught pokemon IDs)
 * Returns an array of pokemon IDs that the user has caught
 * Requires userId parameter
 */
export function usePokedex(userId) {
  return useQuery({
    queryKey: ['pokedex', userId],
    queryFn: () => getUserPokedex(userId),
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
    mutationFn: ({ userId, pokemonId }) => addPokemonToPokedex(userId, pokemonId),
    networkMode: 'offlineFirst',

    // Optimistic update
    onMutate: async ({ userId, pokemonId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pokedex', userId] });

      // Snapshot previous value
      const previousPokedex = queryClient.getQueryData(['pokedex', userId]);

      // Optimistically update cache - add pokemonId to the array
      queryClient.setQueryData(['pokedex', userId], (old) => {
        if (!old) return [pokemonId];
        if (old.includes(pokemonId)) return old; // Already in pokedex
        return [...old, pokemonId];
      });

      return { previousPokedex, userId };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousPokedex) {
        queryClient.setQueryData(
          ['pokedex', context.userId],
          context.previousPokedex
        );
      }

      // Queue for retry when back online
      queueOperation('catch_pokemon', variables);
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
 * Hook to check if a pokemon is in user's pokedex
 * Returns boolean indicating if pokemon is caught
 */
export function useIsPokemonInPokedex(userId, pokemonId) {
  return useQuery({
    queryKey: ['isPokemonInPokedex', userId, pokemonId],
    queryFn: () => isPokemonInPokedex(userId, pokemonId),
    enabled: !!userId && !!pokemonId, // Only run if both parameters exist
    staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    networkMode: 'offlineFirst',
    retry: 3,
  });
}

/**
 * Hook to release a pokemon (remove from pokedex)
 * Handles offline queueing automatically
 */
export function useReleasePokemon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, pokemonId }) => removePokemonFromPokedex(userId, pokemonId),
    networkMode: 'offlineFirst',

    // Optimistic update
    onMutate: async ({ userId, pokemonId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pokedex', userId] });

      // Snapshot previous value
      const previousPokedex = queryClient.getQueryData(['pokedex', userId]);

      // Optimistically update cache - remove pokemonId from the array
      queryClient.setQueryData(['pokedex', userId], (old) => {
        if (!old) return old;
        return old.filter(id => id !== pokemonId);
      });

      return { previousPokedex, userId };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousPokedex && context?.userId) {
        queryClient.setQueryData(
          ['pokedex', context.userId],
          context.previousPokedex
        );
      }

      // Queue for retry when back online
      queueOperation('release_pokemon', variables);
      console.error('Failed to release pokemon, queued for retry:', err);
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pokedex', variables.userId] });
    },

    onSuccess: () => {
      console.log('Pokemon released successfully!');
    }
  });
}
