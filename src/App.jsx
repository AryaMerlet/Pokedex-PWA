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
    <Routes>
      {/* === Pages publiques === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* === Pages protégées === */}
      {/* <Route element={<ProtectedRoute />}> */}
      {/* <Route element={<MainLayout />}> */}
      <Route index element={<Home />} />
      <Route path="/Catch" element={<CatchPage />} />
      <Route path="/Pokedex" element={<PokedexPage />} />
      {/* </Route> */}
      {/* </Route> */}
    </Routes>
  )
}

export default App;
