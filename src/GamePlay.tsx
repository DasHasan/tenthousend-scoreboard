import React, { FC, useState } from 'react';
import './GamePlay.css';

type TableScoreHeader = {
  players: string[];
  playerSums: any[];
};

const TableScoreHeader: FC<TableScoreHeader> = ({ players, playerSums }) => {
  return (
    <tr>
      {players.map((player, idx) => (
        <th key={player}>
          {player}
          <br />
          <small>{playerSums[idx]}</small>
        </th>
      ))}
    </tr>
  );
};

type GamePlayProps = {
  currentPlayerIndex: number;
  players: string[];
  playerScores: number[][];
  onScoreUpdate: (score: number) => void;
};

const GamePlay: FC<GamePlayProps> = ({
  currentPlayerIndex,
  players,
  playerScores,
  onScoreUpdate,
}) => {
  const [scoreInput, setScoreInput] = useState('');
  const playerSums = playerScores.length
    ? playerScores.reduce(
        (acc, curr) => curr.map((score, idx) => acc[idx] + score),
        Array(players.length).fill(0)
      )
    : Array(players.length).fill(0);

  const handleScoreSubmit = () => {
    onScoreUpdate(Number(scoreInput));
    setScoreInput('');
  };

  return (
    <div>
      <h2>It's {players[currentPlayerIndex]}'s turn</h2>
      <input
        type="number"
        value={scoreInput}
        onChange={(e) => setScoreInput(e.target.value)}
        placeholder="Enter points"
      />
      <button onClick={handleScoreSubmit}>Add Score</button>

      <div className="table-wrapper">
        <div className="scrollable-tbody">
          <table>
            <thead>
              <TableScoreHeader playerSums={playerSums} players={players} />
            </thead>
            <tbody>
              {playerScores.map((scoreRow, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex === playerScores.length - 1 ? 'new-row' : ''
                  }
                >
                  {scoreRow.map((score, colIndex) => (
                    <td key={colIndex}>{score}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            {playerScores.length > 5 && (
              <tfoot>
                <TableScoreHeader playerSums={playerSums} players={players} />
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
