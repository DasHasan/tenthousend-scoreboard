import React, { FC } from 'react';

type PlayerCreationProps = {
  players: string[];
  currentPlayer: string;
  onAddPlayer: () => void;
  onPlayerNameChange: (name: string) => void;
  onStartGame: () => void;
};

const PlayerCreation: FC<PlayerCreationProps> = ({
  players,
  currentPlayer,
  onAddPlayer,
  onPlayerNameChange,
  onStartGame,
}) => (
  <div>
    <input
      type="text"
      value={currentPlayer}
      onChange={(e) => onPlayerNameChange(e.target.value)}
      placeholder="Enter player name"
    />
    <button onClick={onAddPlayer}>Add Player</button>
    {players.length > 0 && (
      <>
        <ul>
          {players.map((player, index) => (
            <li key={player}>
              {index + 1}. {player}
            </li>
          ))}
        </ul>
        <button onClick={onStartGame}>Start Game</button>
      </>
    )}
  </div>
);

export default PlayerCreation;
