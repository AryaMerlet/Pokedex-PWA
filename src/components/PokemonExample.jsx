import { usePokemons, usePokedex, useCatchPokemon, useReleasePokemon } from '../hooks/usePokemons';
import { getConnectionStatus } from '../lib/syncService';
import { useState } from 'react';

/**
 * Example component demonstrating TanStack Query hooks usage
 * This shows how to fetch pokemons, manage pokedex, and handle offline mode
 */
export default function PokemonExample() {
  const [userId] = useState('your-user-id-here'); // Replace with actual user ID from auth

  // Fetch all pokemons - automatically cached and works offline
  const {
    data: pokemons,
    isLoading: pokemonsLoading,
    isError: pokemonsError,
    error: pokemonsErrorDetails,
    isFetching: pokemonsFetching
  } = usePokemons();

  // Fetch user's pokedex - automatically cached and works offline
  const {
    data: pokedex,
    isLoading: pokedexLoading,
    isError: pokedexError,
    error: pokedexErrorDetails,
    isFetching: pokedexFetching
  } = usePokedex(userId);

  // Mutations for catching/releasing pokemons
  const catchMutation = useCatchPokemon();
  const releaseMutation = useReleasePokemon();

  // Connection status
  const connectionStatus = getConnectionStatus();

  // Handle catching a pokemon
  const handleCatchPokemon = async (pokemonId) => {
    try {
      await catchMutation.mutateAsync({
        userId,
        pokemonId,
        nickname: null // Optional nickname
      });
      alert('Pokemon caught!');
    } catch (error) {
      // Error is already logged by the hook
      alert('Failed to catch pokemon. Will retry when online.');
    }
  };

  // Handle releasing a pokemon
  const handleReleasePokemon = async (pokedexEntryId) => {
    if (!confirm('Are you sure you want to release this pokemon?')) return;

    try {
      await releaseMutation.mutateAsync(pokedexEntryId);
      alert('Pokemon released!');
    } catch (error) {
      alert('Failed to release pokemon. Will retry when online.');
    }
  };

  return (
    <div className="p-4">
      {/* Connection Status Badge */}
      <div className={`mb-4 inline-block px-3 py-1 rounded-full text-sm font-medium ${
        connectionStatus.isOnline
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {connectionStatus.label}
      </div>

      {/* All Pokemons Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          All Pokemons {pokemonsFetching && !pokemonsLoading && '(Updating...)'}
        </h2>

        {pokemonsLoading && <p>Loading pokemons...</p>}
        {pokemonsError && (
          <p className="text-red-500">
            Error: {pokemonsErrorDetails?.message || 'Failed to load pokemons'}
          </p>
        )}

        {pokemons && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pokemons.map((pokemon) => (
              <div key={pokemon.id} className="border p-4 rounded-lg">
                <img
                  src={pokemon.sprite_url}
                  alt={pokemon.name}
                  className="w-24 h-24 mx-auto"
                />
                <h3 className="text-center font-bold">{pokemon.name}</h3>
                <p className="text-center text-sm text-gray-600">{pokemon.type}</p>
                <button
                  onClick={() => handleCatchPokemon(pokemon.id)}
                  disabled={catchMutation.isPending}
                  className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {catchMutation.isPending ? 'Catching...' : 'Catch'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* User's Pokedex Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          My Pokedex {pokedexFetching && !pokedexLoading && '(Updating...)'}
        </h2>

        {pokedexLoading && <p>Loading your pokedex...</p>}
        {pokedexError && (
          <p className="text-red-500">
            Error: {pokedexErrorDetails?.message || 'Failed to load pokedex'}
          </p>
        )}

        {pokedex && pokedex.length === 0 && (
          <p className="text-gray-500">You haven't caught any pokemons yet!</p>
        )}

        {pokedex && pokedex.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pokedex.map((entry) => (
              <div key={entry.id} className="border p-4 rounded-lg">
                <img
                  src={entry.pokemons?.sprite_url}
                  alt={entry.pokemons?.name}
                  className="w-24 h-24 mx-auto"
                />
                <h3 className="text-center font-bold">
                  {entry.nickname || entry.pokemons?.name}
                </h3>
                <p className="text-center text-sm text-gray-600">
                  Caught: {new Date(entry.caught_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleReleasePokemon(entry.id)}
                  disabled={releaseMutation.isPending}
                  className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {releaseMutation.isPending ? 'Releasing...' : 'Release'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
