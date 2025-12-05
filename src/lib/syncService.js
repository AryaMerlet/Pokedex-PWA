import { getPendingOperations, removeOperation, db } from "./offlineDb";
import {
	addPokemonToPokedex,
	removePokemonFromPokedex,
} from "../utils/pokedex";

/**
 * Sync pending operations when back online
 * @param {QueryClient} queryClient
 * @return {Promise<number>}
 */
export async function syncPendingOperations(queryClient) {
	const pendingOps = await getPendingOperations();

	if (pendingOps.length === 0) {
		console.log("No pending operations to sync");
		return 0;
	}

	console.log(`Syncing ${pendingOps.length} pending operations...`);
	let successCount = 0;

	for (const operation of pendingOps) {
		try {
			await processPendingOperation(operation);
			await removeOperation(operation.id);
			successCount++;
		} catch (error) {
			console.error(`Failed to sync operation ${operation.id}:`, error);

			const retryCount = operation.retryCount + 1;
			const maxRetries = 5;

			if (retryCount >= maxRetries) {
				console.warn(
					`Operation ${operation.id} exceeded max retries, removing...`
				);
				await removeOperation(operation.id);
			} else {
				await db.pendingOperations.update(operation.id, { retryCount });
			}
		}
	}

	if (successCount > 0 && queryClient) {
		await queryClient.invalidateQueries();
	}

	console.log(
		`Successfully synced ${successCount}/${pendingOps.length} operations`
	);
	return successCount;
}

/**
 * Process a single pending operation
 * TODO: replace by hooks
 * @param {object} operation
 * @return {Promise<void>}
 * */
async function processPendingOperation(operation) {
	switch (operation.type) {
		case "catch_pokemon":
			return await addPokemonToPokedex(
				operation.data.userId,
				operation.data.pokemonId
			);

		default:
			throw new Error(`Unknown operation type: ${operation.type}`);
	}
}

/**
 * Setup online/offline event listeners
 * @param {QueryClient} queryClient
 * @returns {function} cleanup function to remove listeners
 */
export function setupOnlineSync(queryClient) {
	const handleOnline = async () => {
		setTimeout(async () => {
			try {
				await syncPendingOperations(queryClient);

				await queryClient.refetchQueries({ type: "active" });
			} catch (error) {
				console.error("Error during online sync:", error);
			}
		}, 1000);
	};

	const handleOffline = () => {
		console.log("Connection lost, entering offline mode");
	};

	window.addEventListener("online", handleOnline);
	window.addEventListener("offline", handleOffline);

	return () => {
		window.removeEventListener("online", handleOnline);
		window.removeEventListener("offline", handleOffline);
	};
}

/**
 * Check connection status and return badge info
 * @return {{isOnline: boolean, status: string, label: string}}
 */
export function getConnectionStatus() {
	return {
		isOnline: navigator.onLine,
		status: navigator.onLine ? "online" : "offline",
		label: navigator.onLine ? "Online" : "Offline",
	};
}
