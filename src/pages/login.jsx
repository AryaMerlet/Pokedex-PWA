import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import LoginForm from "../components/login-form";
import { AnimatedOrbs } from "@/components/animated-orbs";

export default function Login() {
	const { user } = useAuth();

	if (user) return <Navigate to="/" />;

	return (
		<div className="min-h-screen bg-pixel-dark relative overflow-hidden flex items-center justify-center p-6">
			{/* 8-bit Background Pattern */}
			<div className="absolute inset-0 pixel-bg-pattern opacity-50"></div>

			{/* Animated pixel blocks */}
			<AnimatedOrbs />

			{/* Scanline effect */}
			<div className="absolute inset-0 scanlines pointer-events-none"></div>

			<div className="relative z-10 w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}
