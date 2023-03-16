// src/components/PokemonTypeFilter.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquare,
  faFire,
  faTint,
  faBolt,
  faLeaf,
  faSnowflake,
  faFistRaised,
  faSkullCrossbones,
  faMountain,
  faFeather,
  faBrain,
  faBug,
  faGem,
  faGhost,
  faDragon,
  faMoon,
  faCog,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

// Add a mapping for the icons
const typeIcons = {
  normal: faSquare,
  fire: faFire,
  water: faTint,
  electric: faBolt,
  grass: faLeaf,
  ice: faSnowflake,
  fighting: faFistRaised,
  poison: faSkullCrossbones,
  ground: faMountain,
  flying: faFeather,
  psychic: faBrain,
  bug: faBug,
  rock: faGem,
  ghost: faGhost,
  dragon: faDragon,
  dark: faMoon,
  steel: faCog,
  fairy: faStar,
};

const PokemonTypeFilter = ({ pokemonTypes, filterByType, clearFilter }) => {
  return (
    <div className="type-filter">
      <button onClick={() => clearFilter()}>All Types</button>
      {pokemonTypes.map((type) => (
        <button key={type} onClick={() => filterByType(type)}>
          <FontAwesomeIcon icon={typeIcons[type]} /> {type}
        </button>
      ))}
    </div>
  );
};

export default PokemonTypeFilter;
