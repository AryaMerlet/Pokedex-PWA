import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { AuthContext } from "./context/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient, persister } from "./lib/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { setupOnlineSync } from "./lib/syncService";

// App wrapper with sync setup
function AppWithSync() {
	useEffect(() => {
		// Setup online/offline sync
		const cleanup = setupOnlineSync(queryClient);
		return cleanup;
	}, []);

	return <App />;
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			<AuthContext>
				<BrowserRouter>
					<AppWithSync />
				</BrowserRouter>
			</AuthContext>
			<ReactQueryDevtools initialIsOpen={false} />
		</PersistQueryClientProvider>
	</StrictMode>
);
