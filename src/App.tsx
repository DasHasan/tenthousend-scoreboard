import {FC, useState} from 'react';
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

    const contentStyle: React.CSSProperties = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
    };

    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
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
                    </Content>
                    <Footer style={footerStyle}>{gameState === GameState.NEW && (<>Made with ☕ and ❤️</>)}</Footer>
                </Layout>
            </Space>
        </div>
    );
};
