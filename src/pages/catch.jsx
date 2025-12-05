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
import { AnimatedOrbs } from "@/components/animated-orbs";

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
		<div className="min-h-screen bg-pixel-dark relative overflow-hidden">
			{/* 8-bit Background Pattern */}
			<div className="absolute inset-0 pixel-bg-pattern opacity-50"></div>

			{/* Animated pixel blocks */}
			<AnimatedOrbs />

			{/* Scanline effect */}
			<div className="absolute inset-0 scanlines pointer-events-none"></div>

			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-pixel-red mb-3 sm:mb-4 pixel-text-shadow">
						POKEMON DRAW
					</h1>
					<p className="text-[10px] sm:text-xs text-white font-pixel max-w-xl mx-auto">
						{revealed
							? "A WILD POKEMON APPEARED!"
							: "WHO'S THAT POKEMON?"}
					</p>
				</div>

				{/* Pokemon Card */}
				<div className="max-w-md mx-auto mb-8">
					<Card className="bg-pixel-red">
						<CardHeader className="text-center pb-2">
							<CardTitle className="text-white uppercase">
								{loading ? "LOADING..." : revealed ? pokemon?.name : "???"}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col items-center">
							{/* Pokemon Image */}
							<div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 mb-4">
								{loading ? (
									<div className="w-full h-full flex items-center justify-center">
										<div className="pixel-loader"></div>
									</div>
								) : (
									<div className="relative w-full h-full bg-white/20 border-4 border-foreground p-4">
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
											alt={revealed ? pokemon?.name : "???"}
											className={`w-full h-full object-contain pixel-img transition-all duration-500 ${revealed
												? "filter-none scale-100 opacity-100"
												: "brightness-0 scale-90 opacity-80"
												}`}
										/>
										{/* Question mark overlay when hidden */}
										{!revealed && (
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="text-6xl sm:text-7xl font-pixel text-white/50 pixel-blink">
													?
												</span>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Pokemon Stats - only show when revealed */}
							{!loading && pokemon && revealed && pokemon?.stats && (
								<div className="flex gap-4 mb-4 text-white text-[10px] font-pixel">
									<span>HP:{pokemon.stats[0]?.base_stat || "?"}</span>
									<span>ATK:{pokemon.stats[1]?.base_stat || "?"}</span>
									<span>DEF:{pokemon.stats[2]?.base_stat || "?"}</span>
								</div>
							)}

							{/* Added to Pokedex Message */}
							{revealed && pokemon && (
								<div className="text-sm font-pixel mb-4 text-center">
									{catchMutation.isSuccess ? (
										<span className="text-pixel-yellow">
											★ {pokemon.name.toUpperCase()} CAUGHT! ★
										</span>
									) : isAlreadyCaught ? (
										<span className="text-pixel-yellow">
											↻ ALREADY IN POKEDEX
										</span>
									) : null}
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 w-full">
								{!revealed ? (
									<Button
										className="w-full bg-pixel-red text-white font-pixel text-xs"
										onClick={revealPokemon}
										disabled={loading}
									>
										✨ REVEAL! ✨
									</Button>
								) : (
									<Button
										className="w-full bg-pixel-blue text-white font-pixel text-xs"
										onClick={drawAgain}
									>
										DRAW AGAIN
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
						className="w-full sm:w-auto bg-transparent text-white font-pixel text-[10px] px-6 border-white"
						onClick={() => navigate("/")}
					>
						← HOME
					</Button>
					<Button
						variant="outline"
						className="w-full sm:w-auto bg-transparent text-white font-pixel text-[10px] px-6 border-white"
						onClick={() => navigate("/pokedex")}
					>
						POKEDEX →
					</Button>
				</div>
			</div>
		</div>
	);
}
