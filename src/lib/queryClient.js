import { QueryClient } from '@tanstack/react-query';

// Create a persister using localStorage
const persister = {
  persistClient: async (client) => {
    localStorage.setItem('POKEDEX_QUERY_CACHE', JSON.stringify(client));
  },
  restoreClient: async () => {
    const stored = localStorage.getItem('POKEDEX_QUERY_CACHE');
    return stored ? JSON.parse(stored) : undefined;
  },
  removeClient: async () => {
    localStorage.removeItem('POKEDEX_QUERY_CACHE');
  },
};

// Configure QueryClient with offline-first settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 24 hours
      gcTime: 1000 * 60 * 60 * 24,
      // Stale after 5 minutes
      staleTime: 1000 * 60 * 5,
      // Retry failed requests
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus if stale
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Network mode for offline support
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Network mode for mutations
      networkMode: 'offlineFirst',
      // Retry mutations
      retry: 2,
    },
  },
});

export { persister };
