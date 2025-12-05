import supabase from "./supabase";
import {
	savePokemons,
	getOfflinePokemons,
	savePokedex,
	getOfflinePokedex,
	savePokemonStats,
	getOfflinePokemonStats,
	getAllOfflinePokemonStats,
	savePokemonTypes,
	getOfflinePokemonTypes,
	getAllOfflinePokemonTypes,
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

// ==================== POKEMON STATS ====================

/**
 * Get stats for a specific pokemon with offline support
 * @param {number} pokemonId
 * @returns {Promise<Array>} Array of { stat_name, base_stat }
 */
export const getPokemonStats = async (pokemonId) => {
	try {
		// If offline, get from cached data
		if (!isOnline()) {
			console.log("Offline: Loading pokemon stats from IndexedDB");
			return await getOfflinePokemonStats(pokemonId);
		}

		// Fetch from Supabase
		const { data, error } = await supabase
			.from("pokemon_stats")
			.select("*")
			.eq("pokemon_id", pokemonId);
		if (error) throw error;

		// Save to IndexedDB for offline use
		if (data.length > 0) {
			await savePokemonStats(data);
		}

		return data;
	} catch (error) {
		console.error("Error fetching pokemon stats, falling back to offline:", error);
		return await getOfflinePokemonStats(pokemonId);
	}
};

/**
 * Get all pokemon stats with offline support
 * Saves to IndexedDB on success, falls back to cached data on error
 */
export const getAllPokemonStats = async () => {
	try {
		// If offline, return cached data immediately
		if (!isOnline()) {
			console.log("Offline: Loading all pokemon stats from IndexedDB");
			return await getAllOfflinePokemonStats();
		}

		// Fetch from Supabase
		const { data, error } = await supabase.from("pokemon_stats").select("*");
		if (error) throw error;

		// Save to IndexedDB for offline use
		await savePokemonStats(data);

		return data;
	} catch (error) {
		console.error("Error fetching all pokemon stats, falling back to offline:", error);
		return await getAllOfflinePokemonStats();
	}
};

// ==================== POKEMON TYPES ====================

/**
 * Get types for a specific pokemon with offline support
 * @param {number} pokemonId
 * @returns {Promise<Array>} Array of { type_name, slot }
 */
export const getPokemonTypes = async (pokemonId) => {
	try {
		// If offline, get from cached data
		if (!isOnline()) {
			console.log("Offline: Loading pokemon types from IndexedDB");
			return await getOfflinePokemonTypes(pokemonId);
		}

		// Fetch from Supabase
		const { data, error } = await supabase
			.from("pokemon_types")
			.select("*")
			.eq("pokemon_id", pokemonId);
		if (error) throw error;

		// Save to IndexedDB for offline use
		if (data.length > 0) {
			await savePokemonTypes(data);
		}

		return data;
	} catch (error) {
		console.error("Error fetching pokemon types, falling back to offline:", error);
		return await getOfflinePokemonTypes(pokemonId);
	}
};

/**
 * Get all pokemon types with offline support
 * Saves to IndexedDB on success, falls back to cached data on error
 */
export const getAllPokemonTypes = async () => {
	try {
		// If offline, return cached data immediately
		if (!isOnline()) {
			console.log("Offline: Loading all pokemon types from IndexedDB");
			return await getAllOfflinePokemonTypes();
		}

		// Fetch from Supabase
		const { data, error } = await supabase.from("pokemon_types").select("*");
		if (error) throw error;

		// Save to IndexedDB for offline use
		await savePokemonTypes(data);

		return data;
	} catch (error) {
		console.error("Error fetching all pokemon types, falling back to offline:", error);
		return await getAllOfflinePokemonTypes();
	}
};

