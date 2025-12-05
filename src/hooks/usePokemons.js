import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPokemons,
	getUserPokedex,
	addPokemonToPokedex,
	isPokemonInPokedex,
	getPokemonById,
	getPokemonStats,
	getPokemonTypes,
	getAllPokemonStats,
	getAllPokemonTypes,
} from "../utils/pokedex";
import { queueOperation } from "../lib/offlineDb";

/**
 * Hook to fetch all available pokemons
 * Automatically handles caching and offline support
 * @return {Array<Object>}
 */
export function usePokemons() {
	return useQuery({
		queryKey: ["pokemons"],
		queryFn: getPokemons,
		staleTime: 1000 * 60 * 60, // 1 hour
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

export function usePokemonById(pokemonId) {
	return useQuery({
		queryKey: ["pokemon", pokemonId],
		queryFn: () => getPokemonById(pokemonId),
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

/**
 * Hook to fetch user's pokedex (caught pokemon IDs)
 * @param {string} userId
 * @return {Array<number>}
 */
export function usePokedex(userId) {
	return useQuery({
		queryKey: ["pokedex", userId],
		queryFn: () => getUserPokedex(userId),
		enabled: !!userId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

/**
 * Hook to catch a pokemon and add to user's pokedex
 * @returns {function({ userId: string, pokemonId: number })}
 */
export function useCatchPokemon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, pokemonId }) =>
			addPokemonToPokedex(userId, pokemonId),
		networkMode: "offlineFirst",

		onMutate: async ({ userId, pokemonId }) => {
			await queryClient.cancelQueries({ queryKey: ["pokedex", userId] });

			const previousPokedex = queryClient.getQueryData(["pokedex", userId]);

			queryClient.setQueryData(["pokedex", userId], (old) => {
				if (!old) return [pokemonId];
				if (old.includes(pokemonId)) return old;
				return [...old, pokemonId];
			});

			return { previousPokedex, userId };
		},

		onError: (err, variables, context) => {
			if (context?.previousPokedex) {
				queryClient.setQueryData(
					["pokedex", context.userId],
					context.previousPokedex
				);
			}

			queueOperation("catch_pokemon", variables);
			console.error("Failed to catch pokemon, queued for retry:", err);
		},

		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["pokedex", variables.userId],
			});
		},

		onSuccess: () => {
			console.log("Pokemon caught successfully!");
		},
	});
}

/**
 * Hook to check if a pokemon is in user's pokedex
 * @param {string} userId
 * @param {number} pokemonId
 * @return {boolean}
 */
export function useIsPokemonInPokedex(userId, pokemonId) {
	return useQuery({
		queryKey: ["isPokemonInPokedex", userId, pokemonId],
		queryFn: () => isPokemonInPokedex(userId, pokemonId),
		enabled: !!userId && !!pokemonId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

// ==================== POKEMON STATS ====================

/**
 * Hook to fetch stats for a specific pokemon
 * @param {number} pokemonId
 * @return {Array<{ stat_name: string, base_stat: number }>}
 */
export function usePokemonStats(pokemonId) {
	return useQuery({
		queryKey: ["pokemonStats", pokemonId],
		queryFn: () => getPokemonStats(pokemonId),
		enabled: !!pokemonId,
		staleTime: 1000 * 60 * 60, // 1 hour (stats don't change often)
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

/**
 * Hook to fetch all pokemon stats
 * @return {Array<{ pokemon_id: number, stat_name: string, base_stat: number }>}
 */
export function useAllPokemonStats() {
	return useQuery({
		queryKey: ["allPokemonStats"],
		queryFn: getAllPokemonStats,
		staleTime: 1000 * 60 * 60, // 1 hour
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

// ==================== POKEMON TYPES ====================

/**
 * Hook to fetch types for a specific pokemon
 * @param {number} pokemonId
 * @return {Array<{ type_name: string, slot: number }>}
 */
export function usePokemonTypes(pokemonId) {
	return useQuery({
		queryKey: ["pokemonTypes", pokemonId],
		queryFn: () => getPokemonTypes(pokemonId),
		enabled: !!pokemonId,
		staleTime: 1000 * 60 * 60, // 1 hour (types don't change)
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

/**
 * Hook to fetch all pokemon types
 * @return {Array<{ pokemon_id: number, type_name: string, slot: number }>}
 */
export function useAllPokemonTypes() {
	return useQuery({
		queryKey: ["allPokemonTypes"],
		queryFn: getAllPokemonTypes,
		staleTime: 1000 * 60 * 60, // 1 hour
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
		retry: 3,
	});
}

