import { QueryClient } from "@tanstack/react-query";

// Create a persister using localStorage
const persister = {
	persistClient: async (client) => {
		localStorage.setItem("POKEDEX_QUERY_CACHE", JSON.stringify(client));
	},
	restoreClient: async () => {
		const stored = localStorage.getItem("POKEDEX_QUERY_CACHE");
		return stored ? JSON.parse(stored) : undefined;
	},
	removeClient: async () => {
		localStorage.removeItem("POKEDEX_QUERY_CACHE");
	},
};

// Configure QueryClient with offline-first settings
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24,
			staleTime: 1000 * 60 * 5,
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
			// Network mode for offline support
			networkMode: "offlineFirst",
		},
		mutations: {
			networkMode: "offlineFirst",
			retry: 2,
		},
	},
});

export { persister };
