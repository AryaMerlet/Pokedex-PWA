import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg,webp}"],
			},
			manifest: {
				name: "Pokedex PWA",
				short_name: "Pokedex",
				description: "A Pokedex application built with React and Vite",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#ffffff",
				icons: [
					{
						src: "/pokeball-512x512.webp",
						sizes: "192x192",
						type: "image/webp",
					},
					{
						src: "/pokeball-512x512.webp",
						sizes: "512x512",
						type: "image/webp",
					},
				],
			},
		}),
	],
	//cors
	server: {
		cors: true,
		host: "0.0.0.0",
		port: 5173,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@/components": path.resolve(__dirname, "./src/components"),
		},
	},
});
