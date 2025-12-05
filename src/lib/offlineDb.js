import Dexie from "dexie";

// Create offline database using Dexie.js
class PokedexDatabase extends Dexie {
	constructor() {
		super("PokedexDB");

		// Version 1 - original schema
		this.version(1).stores({
			pokemons: "id, name, type, sprite_url, created_at",
			pokedex: "++id, pokemon_id, user_id, caught_at, nickname",
			pendingOperations: "++id, type, data, timestamp, retryCount",
			syncMetadata: "key, lastSyncedAt, version",
		});

		// Version 2 - add pokemon_stats and pokemon_types tables
		this.version(2).stores({
			pokemons: "id, name, type, sprite_url, created_at",
			pokedex: "++id, pokemon_id, user_id, caught_at, nickname",
			pendingOperations: "++id, type, data, timestamp, retryCount",
			syncMetadata: "key, lastSyncedAt, version",
			pokemon_stats: "++id, pokemon_id, stat_name, base_stat",
			pokemon_types: "++id, pokemon_id, type_name, slot",
		});
	}
}

export const db = new PokedexDatabase();

// Helper functions for offline operations

/**
 * Save pokemons to offline DB
 * @param {Array} pokemons
 * @returns {Promise<boolean>}
 */
export async function savePokemons(pokemons) {
	try {
		await db.pokemons.bulkPut(pokemons);
		await db.syncMetadata.put({
			key: "pokemons",
			lastSyncedAt: new Date().toISOString(),
			version: 1,
		});
		return true;
	} catch (error) {
		console.error("Error saving pokemons to offline DB:", error);
		return false;
	}
}

/**
 * Get pokemons from offline DB
 * @return {Promise<Array>}
 */
export async function getOfflinePokemons() {
	try {
		return await db.pokemons.toArray();
	} catch (error) {
		console.error("Error getting offline pokemons:", error);
		return [];
	}
}

/**
 * Save pokedex entries to offline DB
 * @param {*} entries
 * @returns {Promise<boolean>}
 */
export async function savePokedex(entries) {
	try {
		await db.pokedex.bulkPut(entries);
		await db.syncMetadata.put({
			key: "pokedex",
			lastSyncedAt: new Date().toISOString(),
			version: 1,
		});
		return true;
	} catch (error) {
		console.error("Error saving pokedex to offline DB:", error);
		return false;
	}
}

/**
 * Get pokedex entries from offline DB
 * @param {string} userId
 * @return {Promise<Array>}
 */
export async function getOfflinePokedex(userId) {
	try {
		if (userId) {
			return await db.pokedex.where("user_id").equals(userId).toArray();
		}
		return await db.pokedex.toArray();
	} catch (error) {
		console.error("Error getting offline pokedex:", error);
		return [];
	}
}

/**
 * Queue a pending operation for later sync
 * @param {*} type
 * @param {*} data
 * @returns {Promise<boolean>}
 */
export async function queueOperation(type, data) {
	try {
		await db.pendingOperations.add({
			type,
			data,
			timestamp: new Date().toISOString(),
			retryCount: 0,
		});
		return true;
	} catch (error) {
		console.error("Error queuing operation:", error);
		return false;
	}
}

/**
 * Get all pending operations
 * @return {Promise<Array>}
 */
export async function getPendingOperations() {
	try {
		return await db.pendingOperations.toArray();
	} catch (error) {
		console.error("Error getting pending operations:", error);
		return [];
	}
}

/**
 * Remove a completed operation from the queue
 * @param {*} id
 * @returns {Promise<boolean>}
 */
export async function removeOperation(id) {
	try {
		await db.pendingOperations.delete(id);
		return true;
	} catch (error) {
		console.error("Error removing operation:", error);
		return false;
	}
}

// Clear all pending operations
export async function clearPendingOperations() {
	try {
		await db.pendingOperations.clear();
		return true;
	} catch (error) {
		console.error("Error clearing operations:", error);
		return false;
	}
}

// ==================== POKEMON STATS ====================

/**
 * Save pokemon stats to offline DB
 * @param {Array} stats - Array of { pokemon_id, stat_name, base_stat }
 * @returns {Promise<boolean>}
 */
export async function savePokemonStats(stats) {
	try {
		await db.pokemon_stats.bulkPut(stats);
		await db.syncMetadata.put({
			key: "pokemon_stats",
			lastSyncedAt: new Date().toISOString(),
			version: 1,
		});
		return true;
	} catch (error) {
		console.error("Error saving pokemon stats to offline DB:", error);
		return false;
	}
}

/**
 * Get stats for a specific pokemon from offline DB
 * @param {number} pokemonId
 * @return {Promise<Array>}
 */
export async function getOfflinePokemonStats(pokemonId) {
	try {
		return await db.pokemon_stats
			.where("pokemon_id")
			.equals(pokemonId)
			.toArray();
	} catch (error) {
		console.error("Error getting offline pokemon stats:", error);
		return [];
	}
}

/**
 * Get all pokemon stats from offline DB
 * @return {Promise<Array>}
 */
export async function getAllOfflinePokemonStats() {
	try {
		return await db.pokemon_stats.toArray();
	} catch (error) {
		console.error("Error getting all offline pokemon stats:", error);
		return [];
	}
}

// ==================== POKEMON TYPES ====================

/**
 * Save pokemon types to offline DB
 * @param {Array} types - Array of { pokemon_id, type_name, slot }
 * @returns {Promise<boolean>}
 */
export async function savePokemonTypes(types) {
	try {
		await db.pokemon_types.bulkPut(types);
		await db.syncMetadata.put({
			key: "pokemon_types",
			lastSyncedAt: new Date().toISOString(),
			version: 1,
		});
		return true;
	} catch (error) {
		console.error("Error saving pokemon types to offline DB:", error);
		return false;
	}
}

/**
 * Get types for a specific pokemon from offline DB
 * @param {number} pokemonId
 * @return {Promise<Array>}
 */
export async function getOfflinePokemonTypes(pokemonId) {
	try {
		return await db.pokemon_types
			.where("pokemon_id")
			.equals(pokemonId)
			.toArray();
	} catch (error) {
		console.error("Error getting offline pokemon types:", error);
		return [];
	}
}

/**
 * Get all pokemon types from offline DB
 * @return {Promise<Array>}
 */
export async function getAllOfflinePokemonTypes() {
	try {
		return await db.pokemon_types.toArray();
	} catch (error) {
		console.error("Error getting all offline pokemon types:", error);
		return [];
	}
}

// Check if we're online
export function isOnline() {
	return navigator.onLine;
}

