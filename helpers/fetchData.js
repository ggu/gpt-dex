// src/helpers/fetchData.js
const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchTotalCount = async () => {
  const response = await fetch(`${API_BASE_URL}/pokemon`);
  const data = await response.json();
  return data.count;
};

export const fetchPokemonTypes = async () => {
    const response = await fetch(`${API_BASE_URL}/type`);
    const data = await response.json();
    const types = data.results.map((type) => type.name);
    return types.filter((type) => type !== 'shadow' && type !== 'unknown');
  };

export const fetchPokemonData = async (page, limit) => {
  const promises = [];
  const offset = (page - 1) * limit;

  for (let i = offset + 1; i <= offset + limit; i++) {
    promises.push(fetchPokemonDetails(i));
  }

  return await Promise.all(promises);
};

export const fetchPokemonDataByType = async (type, page, limit) => {
  if (!type) {
    return await fetchPokemonData(page, limit);
  }

  const response = await fetch(`${API_BASE_URL}/type/${type}`);
  const data = await response.json();
  const offset = (page - 1) * limit;
  const pokemons = data.pokemon.slice(offset, offset + limit);

  return await Promise.all(pokemons.map((entry) => fetchPokemonDetails(entry.pokemon.url)));
};

export const fetchPokemonDetails = async (urlOrId) => {
    const url = typeof urlOrId === 'string' ? urlOrId : `${API_BASE_URL}/pokemon/${urlOrId}`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.front_default,
    types: data.types,
    height: data.height,
    weight: data.weight,
    url: url
  };
};

export const fetchPokemonMoves = async (pokemonUrl) => {
    try {
        const response = await fetch(pokemonUrl);
        const data = await response.json();
        const moveData = data.moves;
  
      // Filter and sort moves by popularity (usage in battles)
      const popularMoves = moveData
        .filter((move) => move.version_group_details[0].level_learned_at !== 0)
        .sort((a, b) => b.version_group_details[0].level_learned_at - a.version_group_details[0].level_learned_at)
        .slice(0, 5)
        .map((move) => move.move.name);
      return popularMoves;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
