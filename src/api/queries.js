import supabase from '../utils/supabase';
import {
  savePokemons,
  getOfflinePokemons,
  savePokedex,
  getOfflinePokedex,
  isOnline
} from '../lib/offlineDb';

/**
 * Fetch all available pokemons from Supabase
 * Falls back to offline data if network is unavailable
 */
export async function fetchPokemons() {
  try {
    // If offline, return cached data immediately
    if (!isOnline()) {
      console.log('Offline: Loading pokemons from IndexedDB');
      return await getOfflinePokemons();
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('pokemons')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    // Save to offline DB for future use
    await savePokemons(data);

    return data;
  } catch (error) {
    console.error('Error fetching pokemons:', error);

    // Fallback to offline data on error
    console.log('Falling back to offline pokemons');
    return await getOfflinePokemons();
  }
}

/**
 * Fetch user's pokedex entries (caught pokemons) by user_id
 * Falls back to offline data if network is unavailable
 */
export async function fetchPokedex(userId) {
  if (!userId) {
    throw new Error('User ID is required to fetch pokedex');
  }

  try {
    // If offline, return cached data immediately
    if (!isOnline()) {
      console.log('Offline: Loading pokedex from IndexedDB');
      return await getOfflinePokedex(userId);
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('pokedex')
      .select(`
        *,
        pokemons (
          id,
          name,
          type,
          sprite_url
        )
      `)
      .eq('user_id', userId)
      .order('caught_at', { ascending: false });

    if (error) throw error;

    // Save to offline DB for future use
    await savePokedex(data);

    return data;
  } catch (error) {
    console.error('Error fetching pokedex:', error);

    // Fallback to offline data on error
    console.log('Falling back to offline pokedex');
    return await getOfflinePokedex(userId);
  }
}

/**
 * Catch a pokemon and add to user's pokedex
 * Queues operation if offline
 */
export async function catchPokemon({ userId, pokemonId, nickname }) {
  const { data, error } = await supabase
    .from('pokedex')
    .insert({
      user_id: userId,
      pokemon_id: pokemonId,
      nickname: nickname || null,
      caught_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Release a pokemon from user's pokedex
 * Queues operation if offline
 */
export async function releasePokemon(pokedexEntryId) {
  const { error } = await supabase
    .from('pokedex')
    .delete()
    .eq('id', pokedexEntryId);

  if (error) throw error;
  return { success: true };
}
