import React, { useState, useEffect, useContext, createContext } from "react";

const Auth = createContext();

export const AuthContext = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				const response = await account.get();
				const session = await account.listSessions();
				setUser(response);
			} catch (err) {
				setUser(null);
				console.log("No active session:", err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchUser();
	}, []);

	async function login(email, password) {
		const response = await account.createEmailPasswordSession(email, password);
		setUser(response);
	}
	async function logout() {
		await account.deleteSession("current").then(
			() => {
				setUser(null);
				console.log("User logged out");
			},
			(err) => {
				console.log(err);
			}
		);
	}

	async function signup(email, password, name) {
		console.log(email, password, name);
		try {
			await account.create(ID.unique(), email, password, name);
			console.log("User created");
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<Auth value={{ user, login, logout, signup }}>
			{isLoading ? <div>Loading...</div> : children}
		</Auth>
	);
};

export const useAuth = () => useContext(Auth);
