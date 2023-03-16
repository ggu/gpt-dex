// src/components/PokemonCard.js
import React from 'react';
// import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const { name, image, height, weight, types, moves } = pokemon;
  const mainType = types[0].type.name;
  const heightInMeters = height / 10;
  const weightInKilograms = weight / 10;

  return (
    <div className={`pokemon ${mainType}`}>
      <div className="pokemon-img-container">
        <img src={image} alt={name} />
      </div>
      <div className="pokemon-info">
        <h3 className="pokemon-name">{name}</h3>
        <p>
          Height: {heightInMeters} m <br />
          Weight: {weightInKilograms} kg
        </p>
        <div className="pokemon-types">
        {types.map((typeObj, index) => (
          <span key={typeObj.type.name}>
            {typeObj.type.name}
            {index !== pokemon.types.length - 1 && ', '}
          </span>
        ))}
        <p>
            <strong>Popular Moves:</strong> {moves.join(', ')}
        </p>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
