import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AnimatedOrbs } from "@/components/animated-orbs";
import { Checkbox } from "@/components/ui/checkbox";
import { usePokedex, usePokemons, useAllPokemonTypes } from "@/hooks/usePokemons";



// Type colors mapping - 8-bit palette
const typeColors = {
	Normal: "bg-[#a8a878]",
	Fire: "bg-[#f08030]",
	Water: "bg-[#6890f0]",
	Electric: "bg-[#f8d030]",
	Grass: "bg-[#78c850]",
	Ice: "bg-[#98d8d8]",
	Fighting: "bg-[#c03028]",
	Poison: "bg-[#a040a0]",
	Ground: "bg-[#e0c068]",
	Flying: "bg-[#a890f0]",
	Psychic: "bg-[#f85888]",
	Bug: "bg-[#a8b820]",
	Rock: "bg-[#b8a038]",
	Ghost: "bg-[#705898]",
	Dragon: "bg-[#7038f8]",
	Dark: "bg-[#705848]",
	Steel: "bg-[#b8b8d0]",
	Fairy: "bg-[#ee99ac]",
};

const typeBadgeColors = {
	Normal: "bg-[#a8a878]",
	Fire: "bg-[#f08030]",
	Water: "bg-[#6890f0]",
	Electric: "bg-[#f8d030] text-gray-800",
	Grass: "bg-[#78c850]",
	Ice: "bg-[#98d8d8] text-gray-800",
	Fighting: "bg-[#c03028]",
	Poison: "bg-[#a040a0]",
	Ground: "bg-[#e0c068] text-gray-800",
	Flying: "bg-[#a890f0]",
	Psychic: "bg-[#f85888]",
	Bug: "bg-[#a8b820]",
	Rock: "bg-[#b8a038]",
	Ghost: "bg-[#705898]",
	Dragon: "bg-[#7038f8]",
	Dark: "bg-[#705848]",
	Steel: "bg-[#b8b8d0] text-gray-800",
	Fairy: "bg-[#ee99ac]",
};


function PokemonItem({ pokemon, isOwned }) {
	return (
		<Card
			key={pokemon.id}
			className={`${typeColors[pokemon.types?.[0]] || "bg-[#a8a878]"} cursor-pointer transition-all duration-200`}
		>
			<CardHeader className="pb-0 pt-2 px-2">
				<div className="text-white/80 text-[8px] font-pixel">#{String(pokemon.id).padStart(3, "0")}</div>
			</CardHeader>
			<CardContent className="p-2 pt-0">
				{/* Pokemon Sprite */}
				<div className="relative w-full aspect-square mb-2 flex items-center justify-center">
					<div className="absolute inset-0 bg-white/20 border-2 border-foreground"></div>
					<img
						src={pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
						alt={isOwned ? pokemon?.name : "???"}
						className={`w-full h-full object-contain pixel-img transition-all duration-300 ${isOwned
							? "filter-none scale-100 opacity-100"
							: "brightness-0 scale-90 opacity-80"
							}`}
					/>
				</div>

				{/* Pokemon Name */}
				<CardTitle className="text-white text-[8px] sm:text-[10px] text-center uppercase mb-1">
					{isOwned ? pokemon.name : "???"}
				</CardTitle>

				{/* Type Badges */}
				<div className="flex flex-wrap justify-center gap-1">
					{pokemon.types?.map((type) => (
						<span
							key={type}
							className={`${typeBadgeColors[type] || "bg-gray-500"} text-white text-[6px] px-1 py-0.5 border-2 border-foreground font-pixel uppercase`}
						>
							{type.slice(0, 3)}
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
	const [selectedType, setSelectedType] = useState("All");
	const [selectedOwned, setSelectedOwned] = useState(true);
	const { user } = useAuth();
	const { data: pokedex, isLoading: pokedexLoading } = usePokedex(user.id);
	const { data: pokemons, isLoading: pokemonsLoading } = usePokemons();
	const { data: allTypes, isLoading: typesLoading } = useAllPokemonTypes();

	// Merge types into pokemons (group types by pokemon_id)
	const pokemonsWithTypes = useMemo(() => {
		if (!pokemons || !allTypes) return pokemons || [];

		// Group types by pokemon_id
		const typesByPokemonId = allTypes.reduce((acc, typeEntry) => {
			const id = typeEntry.pokemon_id;
			if (!acc[id]) acc[id] = [];
			// Capitalize first letter for display
			const typeName = typeEntry.type_name.charAt(0).toUpperCase() + typeEntry.type_name.slice(1);
			acc[id].push(typeName);
			return acc;
		}, {});

		// Merge types into pokemons
		return pokemons.map(pokemon => ({
			...pokemon,
			types: typesByPokemonId[pokemon.id] || []
		}));
	}, [pokemons, allTypes]);

	// Filter pokemons based on search term and selected type state
	const filteredPokemons = pokemonsWithTypes?.filter((pokemon) => {
		const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = selectedType === "All" || pokemon.types?.includes(selectedType);
		const matchesOwned = selectedOwned ? pokedex?.includes(pokemon.id) : true;
		return matchesSearch && matchesType && matchesOwned;
	});

	// Get unique types for filter
	const typeFilterOptions = ["All", ...Object.keys(typeColors)];

	return (
		<div className="min-h-screen bg-pixel-dark relative overflow-hidden">
			{/* 8-bit Background Pattern */}
			<div className="absolute inset-0 pixel-bg-pattern opacity-50"></div>

			{/* Animated pixel blocks */}
			<AnimatedOrbs />

			{/* Scanline effect */}
			<div className="absolute inset-0 scanlines pointer-events-none"></div>

			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				{/* Header Section */}
				<div className="text-center mb-8 sm:mb-12">
					<Button
						variant="ghost"
						className="absolute top-4 left-4 sm:top-8 sm:left-8 text-white z-50 border-2 border-white/50"
						onClick={() => navigate("/")}
					>
						<span className="font-pixel text-[10px]">← BACK</span>
					</Button>

					<div className="pt-12 sm:pt-0">
						<h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-pixel-red mb-3 sm:mb-4 pixel-text-shadow">
							POKEDEX
						</h1>
						<div className="flex items-center justify-center gap-2 mb-4">
							<div className="w-3 h-3 bg-pixel-red border-2 border-white pixel-blink"></div>
							<div className="w-3 h-3 bg-white border-2 border-foreground pixel-blink" style={{ animationDelay: '0.3s' }}></div>
							<div className="w-3 h-3 bg-pixel-red border-2 border-white pixel-blink" style={{ animationDelay: '0.6s' }}></div>
						</div>
						<p className="text-[10px] sm:text-xs text-white font-pixel max-w-2xl mx-auto">
							YOUR POKEMON COLLECTION
						</p>
					</div>
				</div>

				{/* Search and Filter Section */}
				<div className="max-w-4xl mx-auto mb-8 sm:mb-10">
					<div className="bg-card border-4 border-foreground shadow-[4px_4px_0_0] shadow-foreground p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Search Input */}
							<div className="relative flex-1">
								<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">🔍</span>
								<Input
									type="text"
									placeholder="SEARCH..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 bg-pixel-dark border-4 border-foreground text-white placeholder:text-white/50 font-pixel text-[10px]"
								/>
							</div>

							{/* Type Filter */}
							<div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
								<div
									key={"Owned"}
									className={`whitespace-nowrap cursor-pointer flex items-center gap-x-2 px-3 h-8 text-[10px] font-pixel uppercase transition-colors border-4 border-foreground ${selectedOwned
										? "bg-pixel-yellow text-pixel-dark shadow-[2px_2px_0_0] shadow-foreground"
										: "bg-pixel-dark text-white"
										}`}
									onClick={() => setSelectedOwned(!selectedOwned)}
								>
									<Checkbox
										checked={selectedOwned}
										className="w-4 h-4 border-2 border-foreground"
									/>
									OWNED
								</div>
								{typeFilterOptions.map((type) => (
									<Button
										key={type}
										variant={selectedType === type ? "default" : "outline"}
										size="sm"
										className={`whitespace-nowrap font-pixel text-[10px] uppercase ${selectedType === type
											? "bg-pixel-yellow text-pixel-dark"
											: "bg-pixel-dark text-white"
											}`}
										onClick={() => setSelectedType(type)}
									>
										{type.slice(0, 4)}
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Stats Bar */}
				<div className="max-w-4xl mx-auto mb-6 flex justify-between items-center px-2">
					<p className="text-white text-[10px] font-pixel">
						FOUND: <span className="text-pixel-yellow">{filteredPokemons?.length || 0}</span>
					</p>
					{pokedexLoading || pokemonsLoading && (
						<div className="flex items-center gap-2 text-white">
							<div className="pixel-loader"></div>
							<span className="text-[10px] font-pixel">LOADING...</span>
						</div>
					)}
				</div>

				{/* Pokemon Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
					{filteredPokemons?.map((pokemon) => <PokemonItem key={pokemon.id} pokemon={pokemon} isOwned={pokedex?.includes(pokemon.id)} />)}
				</div>

				{/* Empty State */}
				{filteredPokemons?.length === 0 && !(pokemonsLoading || pokedexLoading) && (
					<div className="text-center py-16">
						<div className="bg-card border-4 border-foreground shadow-[4px_4px_0_0] shadow-foreground p-8 max-w-md mx-auto">
							<div className="text-4xl mb-4">😔</div>
							<h3 className="text-sm font-pixel text-pixel-red mb-2">NO POKEMON</h3>
							<p className="text-white/70 text-[10px] font-pixel">TRY DIFFERENT FILTERS</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
