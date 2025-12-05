import supabase from "./supabase";
import {
	savePokemons,
	getOfflinePokemons,
	savePokedex,
	getOfflinePokedex,
	isOnline,
} from "../lib/offlineDb";

/**
 * Get all pokemons with offline support
 * Saves to IndexedDB on success, falls back to cached data on error
 */
export const getPokemons = async () => {
	try {
		// If offline, return cached data immediately
		if (!isOnline()) {
			console.log("Offline: Loading pokemons from IndexedDB");
			return await getOfflinePokemons();
		}

		// Fetch from Supabase
		const { data, error } = await supabase.from("pokemons").select("*");
		if (error) throw error;

		// Save to IndexedDB for offline use
		await savePokemons(data);

		return data;
	} catch (error) {
		console.error("Error fetching pokemons, falling back to offline:", error);
		return await getOfflinePokemons();
	}
};

/**
 * Get a single pokemon by ID with offline support
 */
export const getPokemonById = async (pokemonId) => {
	try {
		// If offline, get from cached data
		if (!isOnline()) {
			console.log("Offline: Loading pokemon from IndexedDB");
			const cached = await getOfflinePokemons();
			return cached.find((p) => p.id === pokemonId);
		}

		// Fetch from Supabase
		const { data, error } = await supabase
			.from("pokemons")
			.select("*")
			.eq("id", pokemonId)
			.single();
		if (error) throw error;

		return data;
	} catch (error) {
		console.error(
			"Error fetching pokemon by ID, falling back to offline:",
			error
		);
		const cached = await getOfflinePokemons();
		return cached.find((p) => p.id === pokemonId);
	}
};

/**
 * Get user's pokedex (pokemon IDs) with offline support
 * Saves to IndexedDB on success, falls back to cached data on error
 */
export const getUserPokedex = async (userId) => {
	try {
		// If offline, return cached data immediately
		if (!isOnline()) {
			console.log("Offline: Loading pokedex from IndexedDB");
			const cached = await getOfflinePokedex(userId);
			return cached.map((entry) => entry.pokemon_id);
		}

		// Fetch from Supabase
		const { data, error } = await supabase
			.from("pokedex")
			.select("*")
			.eq("user_id", userId);
		if (error) throw error;

		// Save to IndexedDB for offline use
		await savePokedex(data);

		// Return just the pokemon IDs
		return data.map((pokemon) => pokemon.pokemon_id);
	} catch (error) {
		console.error("Error fetching pokedex, falling back to offline:", error);
		const cached = await getOfflinePokedex(userId);
		return cached.map((entry) => entry.pokemon_id);
	}
};

/**
 * Add pokemon to user's pokedex
 * Online only - queued for later if offline
 */
export const addPokemonToPokedex = async (userId, pokemonId) => {
	const { data, error } = await supabase
		.from("pokedex")
		.insert({ user_id: userId, pokemon_id: pokemonId });
	if (error) throw error;
	return data;
};

/**
 * Check if pokemon is in user's pokedex
 */
export const isPokemonInPokedex = async (userId, pokemonId) => {
	const { data, error } = await supabase
		.from("pokedex")
		.select("*")
		.eq("user_id", userId)
		.eq("pokemon_id", pokemonId);
	if (error) throw error;
	return data.length > 0;
};

/**
 * Remove pokemon from user's pokedex
 * Online only - queued for later if offline
 */
export const removePokemonFromPokedex = async (userId, pokemonId) => {
	const { error } = await supabase
		.from("pokedex")
		.delete()
		.eq("user_id", userId)
		.eq("pokemon_id", pokemonId);
	if (error) throw error;
	return { success: true };
};
