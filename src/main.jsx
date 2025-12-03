import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { AuthContext } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthContext>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AuthContext>
	</StrictMode>
);
