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
		<div className="min-h-screen bg-linear-to-br from-red-500 via-purple-600 to-blue-600 relative overflow-hidden">
			{/* Animated background orbs - hidden on mobile for performance */}
			<AnimatedOrbs />
			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-0 lg:px-0 py-8 sm:py-12 lg:py-16">
				{/* Hero Section */}
				<div className="text-center mb-12 sm:mb-16 lg:mb-20">
					<div className="mb-6 sm:mb-8 animate-fade-in">
						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 sm:mb-4 drop-shadow-2xl tracking-tight">
							Pokedex PWA
						</h1>
						<div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse"></div>
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400 animate-pulse animation-delay-150"></div>
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse animation-delay-300"></div>
						</div>
						<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed px-4">
							Catch, collect, and explore the world of Pokemon. Your digital Pokedex companion awaits!
						</p>
					</div>

					{user ? (
						<div className="flex flex-col items-center gap-4 animate-fade-in animation-delay-300 px-0">
							{/* User Info Card */}
							<div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 sm:p-6 shadow-xl">
								<div className="flex items-center gap-3 sm:gap-4">
									<div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
										<span className="text-xl sm:text-2xl font-bold text-white">
											{user.email?.charAt(0).toUpperCase() || "U"}
										</span>
									</div>
									<div className="text-left">
										<p className="text-white/70 text-sm">Welcome back, Trainer!</p>
										<p className="text-white font-semibold text-base sm:text-lg truncate max-w-[200px] sm:max-w-[300px]">
											{user.email}
										</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
								<Button
									size="lg"
									className="w-full sm:w-auto bg-white text-purple-700 hover:bg-white/90 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
									onClick={() => navigate("/pokedex")}
								>
									Go to Pokedex
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto bg-red-500/80 backdrop-blur-sm text-white border-red-400/40 hover:bg-red-600 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
									onClick={handleLogout}
								>
									Logout
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in animation-delay-300 px-4">
							<Button
								size="lg"
								className="w-full sm:w-auto bg-white text-purple-700 hover:bg-white/90 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
								onClick={() => navigate("/login")}
							>
								Get Started
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
								onClick={() => navigate("/pokedex")}
							>
								Explore Pokedex
							</Button>
						</div>
					)}
				</div>

				{/* Features Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
					{/* Login/Profile Feature */}
					{user ? (
						<Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 sm:hover:scale-105 hover:shadow-2xl animate-fade-in-up">
							<CardHeader>
								<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
									<svg
										className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<CardTitle className="text-xl sm:text-2xl font-bold text-white">Your Profile</CardTitle>
								<CardDescription className="text-white/80 text-sm sm:text-base">
									Logged in as {user.email}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm sm:text-base"
									onClick={handleLogout}
								>
									Sign Out
								</Button>
							</CardContent>
						</Card>
					) : (
						<Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 sm:hover:scale-105 hover:shadow-2xl animate-fade-in-up">
							<CardHeader>
								<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
									<svg
										className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<CardTitle className="text-xl sm:text-2xl font-bold text-white">Login & Profile</CardTitle>
								<CardDescription className="text-white/80 text-sm sm:text-base">
									Create your trainer account and track your progress across devices
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm sm:text-base"
									onClick={() => navigate("/login")}
								>
									Sign In
								</Button>
							</CardContent>
						</Card>
					)}

					{/* Catch Feature */}
					<Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 sm:hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-150">
						<CardHeader>
							<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-red-400 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
								<svg
									className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
									<circle cx="12" cy="12" r="3" fill="currentColor" />
									<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
								</svg>
							</div>
							<CardTitle className="text-xl sm:text-2xl font-bold text-white">Catch Pokemon</CardTitle>
							<CardDescription className="text-white/80 text-sm sm:text-base">
								Discover and catch wild Pokemon to add them to your collection
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm sm:text-base"
								onClick={() => navigate("/catch")}
							>
								Start Catching
							</Button>
						</CardContent>
					</Card>

					{/* Pokedex Feature */}
					<Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 sm:hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-300 sm:col-span-2 lg:col-span-1">
						<CardHeader>
							<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
								<svg
									className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<CardTitle className="text-xl sm:text-2xl font-bold text-white">Your Pokedex</CardTitle>
							<CardDescription className="text-white/80 text-sm sm:text-base">
								Browse your complete Pokemon collection and view detailed stats
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-sm sm:text-base"
								onClick={() => navigate("/pokedex")}
							>
								View Pokedex
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Additional Info */}
				<div className="mt-12 sm:mt-16 lg:mt-20 text-center px-4">
					<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
						<h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
							🎮 Progressive Web App
						</h2>
						<p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
							Install this app on your device for a native-like experience.
							Works offline, lightning fast, and always ready to help you become the ultimate Pokemon Trainer!
						</p>
					</div>
				</div>
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
					animation: fade-in 0.8s ease-out;
				}
				@keyframes fade-in-up {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.8s ease-out;
				}
			`}</style>
		</div>
	);
}
