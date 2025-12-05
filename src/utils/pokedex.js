import supabase from "./supabase";

export const getUserPokedex = async (userId) => {
    const { data, error } = await supabase
        .from('pokedex')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    let returnData = data.map((pokemon) => pokemon.pokemon_id);
    return returnData;
}

export const addPokemonToPokedex = async (userId, pokemonId) => {
    const { data, error } = await supabase
        .from('pokedex')
        .insert({ user_id: userId, pokemon_id: pokemonId });
    if (error) throw error;
    return data;
}

export const isPokemonInPokedex = async (userId, pokemonId) => {
    const { data, error } = await supabase
        .from('pokedex')
        .select('*')
        .eq('user_id', userId)
        .eq('pokemon_id', pokemonId);
    if (error) throw error;
    return data.length > 0;
}

export const getPokemons = async () => {
    const { data, error } = await supabase
        .from('pokemons')
        .select('*');
    if (error) throw error;
    return data;
}

export const removePokemonFromPokedex = async (userId, pokemonId) => {
    const { error } = await supabase
        .from('pokedex')
        .delete()
        .eq('user_id', userId)
        .eq('pokemon_id', pokemonId);
    if (error) throw error;
    return { success: true };
}
