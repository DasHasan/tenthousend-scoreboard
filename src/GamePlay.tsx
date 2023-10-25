/** @jsxImportSource @emotion/react */
import {FC, useRef, useState} from 'react';
import {Button, Input, Space, Table, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import './GamePlay.css';

type GamePlayProps = {
    currentPlayerIndex: number;
    players: string[];
    playerScores: number[][];
    onScoreUpdate: (score: number) => void;
    onUndo: () => void; // Add this line
};

interface DataType {
    key: string;
}

const GamePlay: FC<GamePlayProps> = ({
                                         currentPlayerIndex,
                                         players,
                                         playerScores,
                                         onUndo,
                                         onScoreUpdate,
                                     }) => {
    const [scoreInput, setScoreInput] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [previousScores, setPreviousScores] = useState<number[][]>([]);

    const inputRef = useRef(null);
    const tableBodyRef = useRef(null);

    const isValidScore = (score: number) => {
        return score >= 350 && score % 50 === 0;
    };

    const handleScoreSubmit = () => {
        if (scoreInput && isValidScore(Number(scoreInput))) {
            setPreviousScores(playerScores); // Save the current scores
            onScoreUpdate(Number(scoreInput));
            setScoreInput('');
            setShowTooltip(false); // hide tooltip when input is valid
        } else {
            setShowTooltip(true); // show tooltip on invalid input
        }
        inputRef.current?.focus();
        scrollToBottom();
    };

    const handleMiss = () => {
        setPreviousScores(playerScores); // Save the current scores
        onScoreUpdate(0);
        if (lastThreeScoresAreZero()) {
            onScoreUpdate(-500);
        }
        setScoreInput('');
        inputRef.current?.focus();
        scrollToBottom();
    };

    const lastThreeScoresAreZero = () => {
        const currentPlayerScores = playerScores.map(scoreRow => scoreRow[currentPlayerIndex]);
        const lastThree = currentPlayerScores.slice(-3);
        return lastThree.length === 3 && lastThree.every(score => score === 0);
    };

    // Define the RowHead column
    // Construct the columns for Ant Design table, starting with the RowHead column.
    const columns: ColumnsType<DataType> = [
        {
            dataIndex: 'key',
            width: '2ch', // 2 characters wide
            key: 'key',
            rowScope: 'row',
        },
        ...players.map((player, idx) => ({
            title: () => idx === currentPlayerIndex ? <span className="highlight-column">{player}</span> : player,
            dataIndex: `player${idx}`,
            key: idx,
            width: idx === currentPlayerIndex ? 120 : 100,
            className: idx === currentPlayerIndex ? 'highlight-column' : '',
            render: (score: number) => {
                let className = '';
                if (score === 0) {
                    className = 'ant-btn-warning';
                } else if (score === -500) {
                    className = 'ant-btn-danger';
                }
                return <span className={className}>{score}</span>;
            }
        }))
    ];

    // Construct the data for Ant Design table.
    const dataSource = playerScores.map((scoreRow, rowIndex) => ({
        key: rowIndex.toString(),
        ...scoreRow.reduce((obj, score, idx) => {
            obj[`player${idx}`] = score;
            return obj;
        }, {})
    }));

    // Calculate the total score for each player
    const getTotalScores = () => {
        return playerScores.reduce((acc, curr) => {
            return curr.map((score, idx) => Math.max(0, acc[idx] + score));
        }, Array(players.length).fill(0));
    };

    const totalScores = getTotalScores();
    const scrollToBottom = () => {
        if (tableBodyRef.current) {
            const tableBody = tableBodyRef.current.querySelector('.ant-table-body');
            if (tableBody) {
                tableBody.scrollTop = tableBody.scrollHeight;
            }
        }
    };

    const tableTitle = () => (
        <Space>
            <Button onClick={handleMiss}>Ciao!</Button>
            <Tooltip title="🚫" open={showTooltip}>
                <Input
                    type="number"
                    ref={inputRef}
                    value={scoreInput}
                    onChange={(e) => {
                        setScoreInput(e.target.value);
                        setShowTooltip(false); // hide tooltip when user starts typing
                    }}
                    placeholder="Punkte"
                    onPressEnter={handleScoreSubmit}  // Bind the submission to Enter key
                />
            </Tooltip>
            <Button onClick={() => onUndo()}>Undo</Button>
        </Space>
    )

    const summary = () => (
        <Table.Summary fixed={'bottom'}>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                {totalScores.map((total, idx) => (
                    <Table.Summary.Cell key={idx} index={idx + 1}>
                        {total}
                    </Table.Summary.Cell>
                ))}
            </Table.Summary.Row>
        </Table.Summary>
    );

    return (
        <Table
            ref={tableBodyRef}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            title={tableTitle}
            scroll={{y: 200}}
            sticky
            summary={summary}
        />
    );
};

export default GamePlay;
