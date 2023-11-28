import os
import requests
import json

def fetch_pokemon_data(pokemon_id_or_name):
    url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_id_or_name}/'
    response = requests.get(url)

    if response.status_code == 200:
        pokemon_data = response.json()
        return pokemon_data
    else:
        print(f"Error fetching data for Pokémon {pokemon_id_or_name}. Status code: {response.status_code}")
        return None

def download_pokemon_image(name):
    image_url = f'https://img.pokemondb.net/artwork/{name.lower()}.jpg'
    response = requests.get(image_url)

    if response.status_code == 200:
        folder_path = 'pokemon_images'
        os.makedirs(folder_path, exist_ok=True)  # Create the folder if it doesn't exist

        with open(os.path.join(folder_path, f'{name}.png'), 'wb') as image_file:
            image_file.write(response.content)
        print(f"Image downloaded for {name}")
    else:
        print(f"Error downloading image for {name}. Status code: {response.status_code}")

def extract_pokemon_info(pokemon_data):
    name = pokemon_data['name']
    download_pokemon_image(name)  # Download the image

    pokemon_info = {
        'id': pokemon_data['id'],
        'name': name,
        'image': f'pokemon_images/{name}.png',  # Include the image filename with the folder path
        'types': [type['type']['name'] for type in pokemon_data['types']],
        'base_experience': pokemon_data['base_experience'],
        'moves': [{'name': move['move']['name'],
                   'method': move['version_group_details'][0]['move_learn_method'],
                   'level': move['version_group_details'][0]['level_learned_at'],
                   'generation': move['version_group_details'][0]['version_group']['name']}
                  for move in pokemon_data['moves']],
    }

    # Remove 'level' for moves learned by TM/HM and 'url' from the method field
    for move in pokemon_info['moves']:
        if move['method'] in ['machine', 'tutor']:
            move.pop('level', None)
            move['method'] = 'TM/HM'

    return pokemon_info

def main():
    # Specify the range of Pokémon IDs you want to fetch (e.g., from 1 to 900)
    start_pokemon_id = 1
    end_pokemon_id = 1017  # Adjust the end_pokemon_id as needed

    all_pokemon_info = []

    for pokemon_id in range(start_pokemon_id, end_pokemon_id + 1):
        pokemon_data = fetch_pokemon_data(pokemon_id)

        if pokemon_data:
            pokemon_info = extract_pokemon_info(pokemon_data)
            all_pokemon_info.append(pokemon_info)

    # Save all Pokémon info to a single JSON file
    with open('all_pokemon_data.json', 'w') as json_file:
        json.dump(all_pokemon_info, json_file, indent=4)

if __name__ == "__main__":
    main()
