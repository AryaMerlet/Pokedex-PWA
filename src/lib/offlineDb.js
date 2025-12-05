import Dexie from "dexie";

// Create offline database using Dexie.js
class PokedexDatabase extends Dexie {
	constructor() {
		super("PokedexDB");

		this.version(1).stores({
			pokemons: "id, name, type, sprite_url, created_at",
			pokedex: "++id, pokemon_id, user_id, caught_at, nickname",
			pendingOperations: "++id, type, data, timestamp, retryCount",
			syncMetadata: "key, lastSyncedAt, version",
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

// Check if we're online
export function isOnline() {
	return navigator.onLine;
}
