import { getPendingOperations, removeOperation, db } from './offlineDb';
import { catchPokemon, releasePokemon } from '../api/queries';

/**
 * Sync pending operations when back online
 * Returns the number of operations synced successfully
 */
export async function syncPendingOperations(queryClient) {
  const pendingOps = await getPendingOperations();

  if (pendingOps.length === 0) {
    console.log('No pending operations to sync');
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

      // Increment retry count
      const retryCount = operation.retryCount + 1;
      const maxRetries = 5;

      if (retryCount >= maxRetries) {
        console.warn(`Operation ${operation.id} exceeded max retries, removing...`);
        await removeOperation(operation.id);
      } else {
        // Update retry count
        await db.pendingOperations.update(operation.id, { retryCount });
      }
    }
  }

  // Invalidate all queries to refetch latest data
  if (successCount > 0 && queryClient) {
    await queryClient.invalidateQueries();
  }

  console.log(`Successfully synced ${successCount}/${pendingOps.length} operations`);
  return successCount;
}

/**
 * Process a single pending operation
 */
async function processPendingOperation(operation) {
  switch (operation.type) {
    case 'catch_pokemon':
      return await catchPokemon(operation.data);

    case 'release_pokemon':
      return await releasePokemon(operation.data.entryId);

    default:
      throw new Error(`Unknown operation type: ${operation.type}`);
  }
}

/**
 * Setup online/offline event listeners
 * Automatically syncs when connection is restored
 */
export function setupOnlineSync(queryClient) {
  const handleOnline = async () => {
    console.log('Connection restored, syncing pending operations...');

    // Wait a bit to ensure connection is stable
    setTimeout(async () => {
      try {
        await syncPendingOperations(queryClient);

        // Refetch all active queries
        await queryClient.refetchQueries({ type: 'active' });
      } catch (error) {
        console.error('Error during online sync:', error);
      }
    }, 1000);
  };

  const handleOffline = () => {
    console.log('Connection lost, entering offline mode');
  };

  // Add event listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Check connection status and return badge info
 */
export function getConnectionStatus() {
  return {
    isOnline: navigator.onLine,
    status: navigator.onLine ? 'online' : 'offline',
    label: navigator.onLine ? 'Online' : 'Offline'
  };
}
