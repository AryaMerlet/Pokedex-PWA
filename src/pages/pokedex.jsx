import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPokemons, getUserPokedex, isPokemonInPokedex } from "@/utils/pokedex";
import { useAuth } from "@/context/AuthContext";
import { AnimatedOrbs } from "@/components/animated-orbs";
import { Checkbox } from "@/components/ui/checkbox";



// Type colors mapping
const typeColors = {
	Normal: "from-gray-400 to-gray-500",
	Fire: "from-orange-400 to-red-500",
	Water: "from-blue-400 to-blue-600",
	Electric: "from-yellow-300 to-yellow-500",
	Grass: "from-green-400 to-green-600",
	Ice: "from-cyan-300 to-cyan-500",
	Fighting: "from-red-600 to-red-800",
	Poison: "from-purple-400 to-purple-600",
	Ground: "from-amber-500 to-amber-700",
	Flying: "from-indigo-300 to-indigo-500",
	Psychic: "from-pink-400 to-pink-600",
	Bug: "from-lime-400 to-lime-600",
	Rock: "from-stone-400 to-stone-600",
	Ghost: "from-purple-600 to-purple-800",
	Dragon: "from-violet-500 to-violet-700",
	Dark: "from-gray-700 to-gray-900",
	Steel: "from-slate-400 to-slate-600",
	Fairy: "from-pink-300 to-pink-500",
};

const typeBadgeColors = {
	Normal: "bg-gray-400",
	Fire: "bg-orange-500",
	Water: "bg-blue-500",
	Electric: "bg-yellow-400 text-gray-800",
	Grass: "bg-green-500",
	Ice: "bg-cyan-400",
	Fighting: "bg-red-700",
	Poison: "bg-purple-500",
	Ground: "bg-amber-600",
	Flying: "bg-indigo-400",
	Psychic: "bg-pink-500",
	Bug: "bg-lime-500",
	Rock: "bg-stone-500",
	Ghost: "bg-purple-700",
	Dragon: "bg-violet-600",
	Dark: "bg-gray-800",
	Steel: "bg-slate-500",
	Fairy: "bg-pink-400",


};


function PokemonItem({ pokemon, isOwned }) {
	return (
		<Card
			key={pokemon.id}
			className={`bg-linear-to-br ${typeColors[pokemon.types?.[0]] || "from-gray-400 to-gray-500"} border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl animate-fade-in-up group`}
		>
			<CardHeader className="pb-0 pt-3 px-3">
				<div className="text-white/60 text-xs font-bold">#{String(pokemon.id).padStart(3, "0")}</div>
			</CardHeader>
			<CardContent className="p-3 pt-0">
				{/* Pokemon Sprite */}
				<div className="relative w-full aspect-square mb-2 flex items-center justify-center">
					<div className="absolute inset-0 bg-white/10 rounded-full scale-75 group-hover:scale-90 transition-transform"></div>
					<img
						src={pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
						alt={isOwned ? pokemon?.name : "Mystery Pokemon"}
						className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ${isOwned
							? "filter-none scale-100 opacity-100"
							: "brightness-0 scale-90 opacity-80"
							}`}
					/>
				</div>

				{/* Pokemon Name */}
				<CardTitle className="text-white text-sm sm:text-base font-bold text-center capitalize mb-2">
					{isOwned ? pokemon.name : "Mystery Pokemon"}
				</CardTitle>

				{/* Type Badges */}
				<div className="flex flex-wrap justify-center gap-1">
					{pokemon.types?.map((type) => (
						<span
							key={type}
							className={`${typeBadgeColors[type] || "bg-gray-500"} text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm`}
						>
							{type}
						</span>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default function Pokedex() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [selectedType, setSelectedType] = useState("All");
	const [selectedOwned, setSelectedOwned] = useState(true);
	const [myPokemons, setMyPokemons] = useState([]);
	const [allPokemons, setAllPokemons] = useState([]);
	const { user } = useAuth();

	// Fetch pokemons from database
	useEffect(() => {
		async function initPokedex() {
			const pokedex = await getUserPokedex(user.id);
			const pokemons = await getPokemons();
			setAllPokemons(pokemons);
			setMyPokemons(pokedex);
			setLoading(false);
		}
		initPokedex();
	}, []);

	// Filter pokemons based on search term and selected type state
	const filteredPokemons = allPokemons.filter((pokemon) => {
		const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = selectedType === "All" || pokemon.types?.includes(selectedType);
		const matchesOwned = selectedOwned ? myPokemons.includes(pokemon.id) : true;
		return matchesSearch && matchesType && matchesOwned;
	});

	// Get unique types for filter
	const allTypes = ["All", ...Object.keys(typeColors)];

	return (
		<div className="min-h-screen bg-linear-to-br from-green-500 via-teal-600 to-blue-600 relative overflow-hidden">
			{/* Animated background orbs - hidden on mobile for performance */}
			<AnimatedOrbs />

			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				{/* Header Section */}
				<div className="text-center mb-8 sm:mb-12 animate-fade-in">
					<Button
						variant="ghost"
						className="absolute top-4 left-4 sm:top-8 sm:left-8 text-white hover:bg-white/20 z-50"
						onClick={() => navigate("/")}
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back
					</Button>

					<div className="pt-12 sm:pt-0">
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 sm:mb-4 drop-shadow-2xl tracking-tight">
							Pokédex
						</h1>
						<div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4">
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse"></div>
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-teal-400 animate-pulse animation-delay-150"></div>
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400 animate-pulse animation-delay-300"></div>
						</div>
						<p className="text-base sm:text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
							Discover and explore all Pokemon in your collection
						</p>
					</div>
				</div>

				{/* Search and Filter Section */}
				<div className="max-w-4xl mx-auto mb-8 sm:mb-10 animate-fade-in animation-delay-150">
					<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Search Input */}
							<div className="relative flex-1">
								<svg
									className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								<Input
									type="text"
									placeholder="Search Pokemon..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/60 rounded-xl"
								/>
							</div>

							{/* Type Filter */}
							<div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
								<Button
									key={"Owned"}
									variant={selectedOwned ? "default" : "outline"}
									size="sm"
									className={`whitespace-nowrap rounded-full ${selectedOwned
										? "bg-white text-gray-800 hover:bg-white/90"
										: "bg-white/10 text-white border-white/30 hover:bg-white/20"
										}`}
									onClick={() => setSelectedOwned(!selectedOwned)}
								>
									<Checkbox
										checked={selectedOwned}
										className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
									/>
									Owned
								</Button>
								{["All", "Fire", "Water", "Grass", "Electric", "Psychic"].map((type) => (
									<Button
										key={type}
										variant={selectedType === type ? "default" : "outline"}
										size="sm"
										className={`whitespace-nowrap rounded-full ${selectedType === type
											? "bg-white text-gray-800 hover:bg-white/90"
											: "bg-white/10 text-white border-white/30 hover:bg-white/20"
											}`}
										onClick={() => setSelectedType(type)}
										disabled={type === "All" ? false : true} // TODO: Remove this when implementing pokemon type
									>
										{type}
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Stats Bar */}
				<div className="max-w-4xl mx-auto mb-6 flex justify-between items-center px-2">
					<p className="text-white/80 text-sm sm:text-base">
						Showing <span className="font-bold text-white">{filteredPokemons.length}</span> Pokemon
					</p>
					{loading && (
						<div className="flex items-center gap-2 text-white/80">
							<svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							<span className="text-sm">Loading...</span>
						</div>
					)}
				</div>

				{/* Pokemon Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
					{filteredPokemons.map((pokemon) => <PokemonItem pokemon={pokemon} isOwned={myPokemons.includes(pokemon.id)} />)}
				</div>

				{/* Empty State */}
				{filteredPokemons.length === 0 && !loading && (
					<div className="text-center py-16 animate-fade-in">
						<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
							<svg className="w-16 h-16 mx-auto text-white/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h3 className="text-xl font-bold text-white mb-2">No Pokemon Found</h3>
							<p className="text-white/70">Try adjusting your search or filter criteria</p>
						</div>
					</div>
				)}
			</div>

			<style jsx>{`
				@keyframes blob {
					0%, 100% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
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
				.animation-delay-6000 {
					animation-delay: 6s;
				}
				.animation-delay-150 {
					animation-delay: 150ms;
				}
				.animation-delay-300 {
					animation-delay: 300ms;
				}
				@keyframes fade-in {
					from { opacity: 0; transform: translateY(-20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in {
					animation: fade-in 0.8s ease-out both;
				}
				@keyframes fade-in-up {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.6s ease-out both;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
}
