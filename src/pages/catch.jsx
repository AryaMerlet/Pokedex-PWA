import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	usePokemons,
	useCatchPokemon,
	usePokedex,
} from "@/hooks/usePokemons";
import { useAuth } from "@/context/AuthContext";

export default function Catch() {
	const navigate = useNavigate();
	const { user } = useAuth();

	// State for random Pokemon ID
	const [randomId, setRandomId] = useState(
		() => Math.floor(Math.random() * 151) + 1
	);
	const [revealed, setRevealed] = useState(false);
	const [wasCaughtBefore, setWasCaughtBefore] = useState(false);

	// TanStack Query hooks
	const { data: allPokemons, isLoading: pokemonsLoading } = usePokemons();
	const { data: myPokedex } = usePokedex(user?.id);
	const catchMutation = useCatchPokemon();

	// Derive current Pokemon from cache
	const pokemon = allPokemons?.find((p) => p.id === randomId);
	const loading = pokemonsLoading || !pokemon;

	// Check if already caught using cached pokedex data
	const isAlreadyCaught = myPokedex?.includes(randomId);

	// Reveal the Pokemon and add to Pokedex
	const revealPokemon = async () => {
		setRevealed(true);

		// Capture current state before mutation changes it
		const alreadyCaught = isAlreadyCaught;
		setWasCaughtBefore(alreadyCaught);

		// Only catch if Pokemon is not already in pokedex
		if (pokemon && user && !alreadyCaught) {
			try {
				await catchMutation.mutateAsync({
					userId: user.id,
					pokemonId: pokemon.id,
				});
			} catch (error) {
				console.error("Failed to catch pokemon:", error);
			}
		}
	};

	// Draw again (for testing)
	const drawAgain = () => {
		setRevealed(false);
		setRandomId(Math.floor(Math.random() * 151) + 1);
		setWasCaughtBefore(false);
		catchMutation.reset(); // Reset mutation state for next draw
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-red-500 via-purple-600 to-blue-600 relative overflow-hidden">
			{/* Animated background orbs - hidden on mobile for performance */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
				<div className="absolute top-10 left-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
				<div className="absolute top-20 right-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
				<div className="absolute bottom-10 left-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
			</div>

			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 drop-shadow-2xl tracking-tight">
						Pokemon Draw
					</h1>
					<p className="text-base sm:text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto">
						{revealed
							? "You found a new Pokemon! It's been added to your Pokedex."
							: "A mystery Pokemon awaits! Tap to reveal your catch!"}
					</p>
				</div>

				{/* Pokemon Card */}
				<div className="max-w-md mx-auto mb-8">
					<Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden">
						<CardHeader className="text-center pb-2">
							<CardTitle className="text-xl sm:text-2xl font-bold text-white capitalize">
								{loading ? "Drawing..." : revealed ? pokemon?.name : "???"}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col items-center">
							{/* Pokemon Image */}
							<div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 mb-4">
								{loading ? (
									<div className="w-full h-full flex items-center justify-center">
										<div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
									</div>
								) : (
									<div className="relative w-full h-full bg-white/30 rounded-2xl py-4">
										{/* Hidden silhouette or revealed Pokemon */}
										<img
											src={
												pokemon?.sprite ||
												pokemon?.sprite_url ||
												pokemon?.sprites?.other?.["official-artwork"]
													?.front_default ||
												pokemon?.sprites?.front_default ||
												`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`
											}
											alt={revealed ? pokemon?.name : "Mystery Pokemon"}
											className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ${
												revealed
													? "filter-none scale-100 opacity-100"
													: "brightness-0 scale-90 opacity-80"
											}`}
										/>
										{/* Question mark overlay when hidden */}
										{!revealed && (
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="text-6xl sm:text-7xl lg:text-8xl font-black text-white/50 animate-pulse">
													?
												</span>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Pokemon Stats - only show when revealed */}
							{!loading && pokemon && revealed && pokemon?.stats && (
								<div className="flex gap-4 mb-4 text-white/80 text-sm sm:text-base">
									<span>HP: {pokemon.stats[0]?.base_stat || "?"}</span>
									<span>•</span>
									<span>ATK: {pokemon.stats[1]?.base_stat || "?"}</span>
									<span>•</span>
									<span>DEF: {pokemon.stats[2]?.base_stat || "?"}</span>
								</div>
							)}

							{/* Added to Pokedex Message */}
							{revealed && pokemon && (
								<div className="text-lg sm:text-xl font-bold mb-4 text-green-400">
									{catchMutation.isSuccess ? (
										<>
											🎉{" "}
											{pokemon.name.charAt(0).toUpperCase() +
												pokemon.name.slice(1)}{" "}
											added to your Pokedex!
										</>
									) : isAlreadyCaught ? (
										<>
											🔄{" "}
											{pokemon.name.charAt(0).toUpperCase() +
												pokemon.name.slice(1)}{" "}
											was already in your Pokedex!
										</>
									) : null}
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 w-full">
								{!revealed ? (
									<Button
										className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-base sm:text-lg py-5 sm:py-6 rounded-full shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
										onClick={revealPokemon}
										disabled={loading}
									>
										<span className="flex items-center justify-center gap-2">
											✨ Reveal Pokemon!
										</span>
									</Button>
								) : (
									<Button
										className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-base sm:text-lg py-5 sm:py-6 rounded-full shadow-xl hover:scale-105 transition-transform"
										onClick={drawAgain}
									>
										🔄 Draw Again (Testing)
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Navigation */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
					<Button
						variant="outline"
						className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 font-semibold px-6 py-5 rounded-full"
						onClick={() => navigate("/")}
					>
						← Back Home
					</Button>
					<Button
						variant="outline"
						className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 font-semibold px-6 py-5 rounded-full"
						onClick={() => navigate("/pokedex")}
					>
						View Pokedex →
					</Button>
				</div>
			</div>

			<style jsx>{`
				@keyframes blob {
					0%,
					100% {
						transform: translate(0px, 0px) scale(1);
					}
					33% {
						transform: translate(30px, -50px) scale(1.1);
					}
					66% {
						transform: translate(-20px, 20px) scale(0.9);
					}
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	);
}
