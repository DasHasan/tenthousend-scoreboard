import React, { FC, useState } from 'react';
import GameHeader from './GameHeader';
import PlayerCreation from './PlayerCreation';
import GamePlay from './GamePlay';
import './style.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { GameState } from './GameState';

type Props = {
  name: string;
};

export const App: FC<Props> = ({ name }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.NEW);
  const [players, setPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [playerScores, setPlayerScores] = useState<number[][]>([]);

  const updateScore = (score: number) => {
    const newScores = [...playerScores];
    newScores[newScores.length - 1][currentPlayerIndex] += score;

    if (currentPlayerIndex === players.length - 1) {
      const newRow = Array(players.length).fill(0);
      newScores.push(newRow);
    }

    setPlayerScores(newScores);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const addPlayer = () => {
    if (currentPlayer) {
      setPlayers((prevPlayers) => [...prevPlayers, currentPlayer]);

      setPlayerScores((prevScores) => {
        if (prevScores.length === 0) {
          return [[0]]; // Initialize the first row of scores
        } else {
          const lastRow = [...prevScores[prevScores.length - 1], 0];
          return [...prevScores.slice(0, -1), lastRow];
        }
      });

      setCurrentPlayer('');
    }
  };

  const startGame = () => {
    setGameState('STARTED');
    setCurrentPlayerIndex(0);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '10px',
      }}
    >
      <GameHeader gameState={gameState} />
      <TransitionGroup>
        <CSSTransition key={gameState} timeout={500} classNames="fade">
          <div style={{ '--num-players': players.length }}>
            {gameState === GameState.NEW && (
              <button onClick={() => setGameState(GameState.PLAYER_CREATION)}>
                Start Player Creation
              </button>
            )}
            {gameState === GameState.PLAYER_CREATION && (
              <PlayerCreation
                players={players}
                currentPlayer={currentPlayer}
                onAddPlayer={addPlayer}
                onPlayerNameChange={setCurrentPlayer}
                onStartGame={startGame}
              />
            )}
            {gameState === GameState.STARTED && (
              <GamePlay
                currentPlayerIndex={currentPlayerIndex}
                players={players}
                playerScores={playerScores}
                onScoreUpdate={updateScore}
              />
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
