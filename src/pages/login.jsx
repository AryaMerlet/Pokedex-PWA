import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { FieldDescription } from "@/components/ui/field";
import { Navigate } from "react-router";

export default function LoginForm() {
	const [email, setemail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const { signInWithEmail, user } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		await signInWithEmail(formData.get("email"), formData.get("password"));
	};

	return user ? (
		<Navigate to="/" />
	) : (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">E-mail</Label>
				<Input
					id="email"
					name="email"
					value={email}
					onChange={(e) => setemail(e.target.value)}
					placeholder="Entrez votre e-mail	"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Mot de passe</Label>
				<Input
					id="password"
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Mot de passe"
					required
				/>
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<Button
				type="submit"
				className="w-full bg-orange-500 hover:bg-orange-600"
			>
				Se connecter
			</Button>
			<FieldDescription className="text-center">
				Don&apos;t have an account? <a href="/signup">Sign up</a>
			</FieldDescription>
		</form>
	);
}
