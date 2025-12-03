import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { FieldDescription } from "@/components/ui/field";
import { Navigate } from "react-router";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const { login, user } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		await login(formData.get("username"), formData.get("password"));
	};

	return user ? (
		<Navigate to="/" />
	) : (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="username">Pseudo</Label>
				<Input
					id="username"
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Entrez votre pseudo"
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
