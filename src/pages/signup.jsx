import { SignupForm } from "@/components/signup-form";
import { AnimatedOrbs } from "@/components/animated-orbs";

export default function Page() {
	return (
		<div className="min-h-screen bg-pixel-dark relative overflow-hidden flex items-center justify-center p-6">
			{/* 8-bit Background Pattern */}
			<div className="absolute inset-0 pixel-bg-pattern opacity-50"></div>

			{/* Animated pixel blocks */}
			<AnimatedOrbs />

			{/* Scanline effect */}
			<div className="absolute inset-0 scanlines pointer-events-none"></div>

			<div className="relative z-10 w-full max-w-sm">
				<SignupForm />
			</div>
		</div>
	);
}
