import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router";
import ProtectedRoute from "./pages/protectedRoutes";
import Home from "./pages/home";
import CatchPage from "./pages/catch";
import PokedexPage from "./pages/pokedex";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
// import MainLayout from "./components/mainLayout";
import "./App.css";
import supabase from './utils/supabase'


function App() {
  const [count, setCount] = useState(0)
  const [pokemons, setPokemons] = useState([])

  useEffect(() => {
    async function getPokemons() {
      const { data, error } = await supabase.from('pokemons').select('*')

      if (error) {
        console.error('Error fetching pokemons:', error)
        return
      }
      console.log(data)

    }

    getPokemons()
  }, [])


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ul>
        {pokemons?.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </>
  )
}

export default App;
