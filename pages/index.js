import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react';
import PokemonTypeFilter from '../components/PokemonTypeFilter';
import PokemonCard from '../components/PokemonCard';
import { fetchTotalCount, fetchPokemonTypes, fetchPokemonDataByType, fetchPokemonMoves } from '../helpers/fetchData';

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [typePages, setTypePages] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pokemonPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      setTotalCount(await fetchTotalCount());
      const types = await fetchPokemonTypes();
      setPokemonTypes(types);
      setTypePages(types.reduce((acc, type) => ({ ...acc, [type]: 1 }), {}));
      setTypePages((prevTypePages) => ({ ...prevTypePages, [null]: 1 }));
    };

    fetchData();
  }, []);

  const fetchAndSetPokemonData = useCallback(
    async (type = null, page = typePages[type] || 1) => {
      setLoading(true);
      const fetchedPokemon = await fetchPokemonDataByType(type, page, pokemonPerPage);

      // Fetch moves for each Pokémon
    const pokemonWithMoves = await Promise.all(
      fetchedPokemon.map(async (pokemon) => {
        const moves = await fetchPokemonMoves(pokemon.url);
        return { ...pokemon, moves };
      })
    );

      setPokemonData((prevData) => [...prevData, ...pokemonWithMoves]);
      setLoading(false);
    },
    [pokemonPerPage, typePages]
  );

  useEffect(() => {
    fetchAndSetPokemonData();
  }, []);

  const filterByType = async (type) => {
    setSelectedType(type);
    setPokemonData([]);

    if (!typePages[type]) {
      setTypePages((prevPages) => ({ ...prevPages, [type]: 1 }));
    }

    await fetchAndSetPokemonData(type, typePages[type]);
  };

  const clearFilter = () => {
    setSelectedType(null);
    setPokemonData([]);
    setTypePages((prevTypePages) => ({ ...prevTypePages, [null]: 1 }));
    fetchAndSetPokemonData();
  };

  const handleScroll = useCallback(async () => {
  if (
    window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight ||
    loading
  )
    return;

  setTypePages((prevPages) => {
    const updatedPages = { ...prevPages, [selectedType]: (prevPages[selectedType] || 0) + 1 };
    fetchAndSetPokemonData(selectedType, updatedPages[selectedType]);
    return updatedPages;
  });
}, [loading, selectedType, fetchAndSetPokemonData]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="App">
      <h1>Pokédex</h1>
      <PokemonTypeFilter
        pokemonTypes={pokemonTypes}
        filterByType={filterByType}
        clearFilter={clearFilter}
      />
      {pokemonData.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
}
