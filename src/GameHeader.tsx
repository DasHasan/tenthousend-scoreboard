import React, { FC } from 'react';
import { GameState } from './GameState';

type GameHeaderProps = {
  gameState: GameState;
};

const GameHeader: FC<GameHeaderProps> = ({ gameState }) => {
  if (gameState === 'STARTED') return null;
  return <h1>🎲 10,000 Dice Game 🎲</h1>;
};

export default GameHeader;
