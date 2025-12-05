import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { AnimatedOrbs } from "@/components/animated-orbs";

export default function Home() {
	const navigate = useNavigate();
	const { user, signOut } = useAuth();

	const handleLogout = async () => {
		await signOut();
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
			<div className="relative z-10 container mx-auto px-4 sm:px-0 lg:px-0 py-8 sm:py-12 lg:py-16">
				{/* Hero Section */}
				<div className="text-center mb-12 sm:mb-16 lg:mb-20">
					<div className="mb-6 sm:mb-8">
						<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pixel text-pixel-red mb-3 sm:mb-4 pixel-text-shadow tracking-wide">
							POKEDEX PWA
						</h1>
						<div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
							<div className="w-3 h-3 sm:w-4 sm:h-4 bg-pixel-red border-2 border-white pixel-blink"></div>
							<div className="w-3 h-3 sm:w-4 sm:h-4 bg-white border-2 border-foreground pixel-blink" style={{ animationDelay: '0.3s' }}></div>
							<div className="w-3 h-3 sm:w-4 sm:h-4 bg-pixel-red border-2 border-white pixel-blink" style={{ animationDelay: '0.6s' }}></div>
						</div>
						<p className="text-xs sm:text-sm md:text-base text-white font-pixel max-w-2xl mx-auto leading-relaxed px-4">
							CATCH, COLLECT, AND EXPLORE THE WORLD OF POKEMON!
						</p>
					</div>

					{user ? (
						<div className="flex flex-col items-center gap-4 px-0">
							{/* User Info Card */}
							<div className="bg-card border-4 border-foreground shadow-[4px_4px_0_0] shadow-foreground p-4 sm:p-6">
								<div className="flex items-center gap-3 sm:gap-4">
									<div className="w-12 h-12 sm:w-14 sm:h-14 bg-pixel-yellow border-4 border-foreground flex items-center justify-center shadow-[2px_2px_0_0] shadow-foreground">
										<span className="text-lg sm:text-xl font-pixel text-foreground">
											{user.email?.charAt(0).toUpperCase() || "U"}
										</span>
									</div>
									<div className="text-left">
										<p className="text-black/70 text-[10px] font-pixel">TRAINER:</p>
										<p className="text-pixel-yellow font-pixel text-xs sm:text-sm wrap-break-word max-w-[200px] sm:max-w-[300px]">
											{user.email}
										</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
								<Button
									size="lg"
									className="w-full sm:w-auto bg-pixel-blue text-white font-pixel text-xs px-6 sm:px-8"
									onClick={() => navigate("/pokedex")}
								>
									POKEDEX
								</Button>
								<Button
									size="lg"
									variant="destructive"
									className="w-full sm:w-auto font-pixel text-xs px-6 sm:px-8"
									onClick={handleLogout}
								>
									LOGOUT
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
							<Button
								size="lg"
								className="w-full sm:w-auto bg-pixel-red text-white font-pixel text-xs px-6 sm:px-8"
								onClick={() => navigate("/login")}
							>
								START GAME
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="w-full sm:w-auto bg-pixel-blue text-white font-pixel text-xs px-6 sm:px-8"
								onClick={() => navigate("/pokedex")}
							>
								EXPLORE
							</Button>
						</div>
					)}
				</div>

				{/* Features Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
					{/* Login/Profile Feature */}
					{user ? (
						<Card className="bg-pixel-green">
							<CardHeader>
								<CardTitle className="text-pixel-yellow">PROFILE</CardTitle>
								<CardDescription className="text-white/80">
									LOGGED IN AS {user.email?.split('@')[0]?.toUpperCase()}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									className="w-full bg-pixel-red text-white font-pixel text-[10px]"
									onClick={handleLogout}
								>
									SIGN OUT
								</Button>
							</CardContent>
						</Card>
					) : (
						<Card className="bg-pixel-blue">
							<CardHeader>

								<CardTitle className="text-white">LOGIN</CardTitle>
								<CardDescription className="text-white/80">
									CREATE YOUR TRAINER ACCOUNT
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									className="w-full bg-white text-pixel-blue font-pixel text-[10px]"
									onClick={() => navigate("/login")}
								>
									SIGN IN
								</Button>
							</CardContent>
						</Card>
					)}

					{/* Catch Feature */}
					<Card className="bg-pixel-red">
						<CardHeader>
							<CardTitle className="text-white">CATCH</CardTitle>
							<CardDescription className="text-white/80">
								FIND AND CATCH WILD POKEMON
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className="w-full bg-white text-pixel-red font-pixel text-[10px]"
								onClick={() => navigate("/catch")}
							>
								START
							</Button>
						</CardContent>
					</Card>

					{/* Pokedex Feature */}
					<Card className="bg-pixel-blue sm:col-span-2 lg:col-span-1">
						<CardHeader>
							<CardTitle className="text-white">POKEDEX</CardTitle>
							<CardDescription className="text-white/80">
								VIEW YOUR POKEMON COLLECTION
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className="w-full bg-pixel-yellow text-pixel-dark font-pixel text-[10px]"
								onClick={() => navigate("/pokedex")}
							>
								OPEN
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Additional Info */}
				<div className="mt-12 sm:mt-16 lg:mt-20 text-center px-4">
					<div className="bg-card border-4 border-foreground shadow-[6px_6px_0_0] shadow-foreground p-6 sm:p-8 max-w-4xl mx-auto">
						<h2 className="text-sm sm:text-base font-pixel text-pixel-red mb-3 sm:mb-4">
							🎮 PWA READY
						</h2>
						<p className="text-black text-[10px] sm:text-xs font-pixel leading-relaxed">
							INSTALL THIS APP FOR OFFLINE PLAY. WORKS ANYWHERE, ANYTIME!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
