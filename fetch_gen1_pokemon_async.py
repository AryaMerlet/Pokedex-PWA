import urllib.request
import json
import time
from typing import List, Dict, Optional

def fetch_json(url: str) -> Optional[Dict]:
    """Fetch JSON data from a URL using urllib"""
    try:
        with urllib.request.urlopen(url) as response:
            data = response.read()
            return json.loads(data.decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def fetch_generation_pokemon() -> List[str]:
    """Fetch all Pokemon from Generation 1"""
    url = "https://pokeapi.co/api/v2/generation/1"
    data = fetch_json(url)
    if data:
        return [species['name'] for species in data['pokemon_species']]
    return []

def fetch_pokemon_data(pokemon_name: str) -> Optional[Dict]:
    """Fetch Pokemon basic data and sprites"""
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name}"
    return fetch_json(url)

def fetch_pokemon_species(pokemon_name: str) -> Optional[Dict]:
    """Fetch Pokemon species data for flavor text"""
    url = f"https://pokeapi.co/api/v2/pokemon-species/{pokemon_name}"
    return fetch_json(url)

def extract_yellow_flavor_text(species_data: Dict) -> str:
    """Extract flavor text from Yellow version"""
    if not species_data or 'flavor_text_entries' not in species_data:
        return ""
    
    # Look for Yellow version in English
    for entry in species_data['flavor_text_entries']:
        try:
            if (entry.get('version', {}).get('name') == 'yellow' and 
                entry.get('language', {}).get('name') == 'en' and 
                'flavor_text' in entry):
                # Clean up the flavor text (remove newlines and extra spaces)
                return entry['flavor_text'].replace('\n', ' ').replace('\f', ' ').strip()
        except (KeyError, AttributeError):
            continue
    
    return ""

def process_pokemon(pokemon_name: str) -> Optional[Dict]:
    """Process a single Pokemon and gather all required data"""
    print(f"Processing {pokemon_name}...")
    
    # Fetch pokemon data
    pokemon_data = fetch_pokemon_data(pokemon_name)
    if not pokemon_data:
        return None
    
    # Fetch species data
    species_data = fetch_pokemon_species(pokemon_name)
    
    # Extract official artwork
    official_artwork = None
    if 'sprites' in pokemon_data and pokemon_data['sprites']:
        if 'other' in pokemon_data['sprites'] and pokemon_data['sprites']['other']:
            if 'official-artwork' in pokemon_data['sprites']['other']:
                official_artwork = pokemon_data['sprites']['other']['official-artwork']['front_default']
    
    # Extract Yellow version flavor text
    flavor_text = extract_yellow_flavor_text(species_data) if species_data else ""
    
    return {
        'id': pokemon_data['id'],
        'name': pokemon_data['name'],
        'official_artwork': official_artwork,
        'flavor_text_yellow': flavor_text
    }

def main():
    """Main function to fetch all Generation 1 Pokemon data"""
    print("=" * 60)
    print("Generation 1 Pokemon Data Fetcher")
    print("=" * 60)
    print("\nStarting to fetch Generation 1 Pokemon data...")
    
    # Get list of all Gen 1 Pokemon
    print("Fetching Generation 1 Pokemon list...")
    pokemon_names = fetch_generation_pokemon()
    
    if not pokemon_names:
        print("Error: Could not fetch Pokemon list. Check your internet connection.")
        return
    
    print(f"Found {len(pokemon_names)} Pokemon in Generation 1\n")
    
    # Process all Pokemon
    all_pokemon_data = []
    failed_pokemon = []
    
    for i, name in enumerate(pokemon_names, 1):
        print(f"[{i}/{len(pokemon_names)}] ", end='')
        pokemon_data = process_pokemon(name)
        
        if pokemon_data:
            all_pokemon_data.append(pokemon_data)
        else:
            failed_pokemon.append(name)
        
        # Small delay to be respectful to the API
        time.sleep(0.1)
    
    # Sort by ID
    all_pokemon_data.sort(key=lambda x: x['id'])
    
    # Save to JSON file
    output_file = 'gen1_pokemon.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_pokemon_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"✅ Successfully fetched data for {len(all_pokemon_data)} Pokemon!")
    print(f"📄 Data saved to: {output_file}")
    
    if failed_pokemon:
        print(f"⚠️  Failed to fetch {len(failed_pokemon)} Pokemon: {', '.join(failed_pokemon)}")
    
    # Print a sample
    if all_pokemon_data:
        print("\n" + "=" * 60)
        print("📋 Sample entry (Bulbasaur):")
        print("=" * 60)
        print(json.dumps(all_pokemon_data[0], indent=2, ensure_ascii=False))
    
    print("\n✨ Done! Check the gen1_pokemon.json file for all Pokemon data.")

if __name__ == "__main__":
    main()