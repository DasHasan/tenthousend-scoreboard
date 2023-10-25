import {CSSProperties, FC, useState} from 'react';
import GameHeader from './GameHeader';
import PlayerCreation from './PlayerCreation';
import GamePlay from './GamePlay';
import {GameState} from './GameState';
import {Button, Layout, Space} from "antd";
import './style.css';

type Props = {
    name: string;
};

export const App: FC<Props> = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.NEW);
    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<string>('');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
    const [playerScores, setPlayerScores] = useState<number[][]>([]);

    const updateScore = (score: number) => {
        const newScores = [...playerScores];
        newScores[newScores.length - 1][currentPlayerIndex] += score;

        if (currentPlayerIndex === players.length - 1) {
            const newRow = Array(players.length).fill(null);
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
        setGameState(GameState.STARTED);
        setCurrentPlayerIndex(0);
    };

    const {Footer, Content} = Layout;

    const contentStyle: CSSProperties = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
    };

    const footerStyle: CSSProperties = {
        textAlign: 'center',
    };

    const removePlayer = (index: number) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);

        const newScores = playerScores.map((scoresRow) => {
            const newRow = [...scoresRow];
            newRow.splice(index, 1);
            return newRow;
        });

        setPlayers(newPlayers);
        setPlayerScores(newScores);
    };

    const undoScore = () => {
        if (playerScores.length > 1) {
            // Remove the last score
            const newScores = [...playerScores];
            newScores.pop();
            setPlayerScores(newScores);
            // Set index to the previous player
            setCurrentPlayerIndex(prev => (prev - 1 + players.length) % players.length);
        } else if (playerScores.length === 1) {
            // Reset the first score to 0 for the current player
            const newScores = [[...playerScores[0]]];
            newScores[0][currentPlayerIndex] = 0;
            setPlayerScores(newScores);
        }
    };

    return (
        <div style={{height: '100%'}}>
            <Space direction="vertical" style={{width: '100%'}} size={[0, 48]}>
                <Layout>
                    <Content style={contentStyle}>
                        <GameHeader gameState={gameState}/>
                        <div>
                            {gameState === GameState.NEW && (
                                <Button type={"primary"} onClick={() => setGameState(GameState.PLAYER_CREATION)}>
                                    Start
                                </Button>
                            )}
                            {gameState === GameState.PLAYER_CREATION && (
                                <PlayerCreation
                                    players={players}
                                    currentPlayer={currentPlayer}
                                    onAddPlayer={addPlayer}
                                    onPlayerNameChange={setCurrentPlayer}
                                    onRemovePlayer={removePlayer}
                                    onStartGame={startGame}
                                />
                            )}
                            {gameState === GameState.STARTED && (
                                <GamePlay
                                    currentPlayerIndex={currentPlayerIndex}
                                    players={players}
                                    playerScores={playerScores}
                                    onScoreUpdate={updateScore}
                                    onUndo={undoScore} // Pass the undo function here
                                />
                            )}
                        </div>
                    </Content>
                    <Footer style={footerStyle}>{gameState === GameState.NEW && (<>Made with ☕ and ❤️</>)}</Footer>
                </Layout>
            </Space>
        </div>
    );
};
