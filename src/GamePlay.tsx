/** @jsxImportSource @emotion/react */
import {FC, useRef, useState} from 'react';
import {Button, Input, Space, Table, Tooltip, Typography} from "antd";
import {ColumnsType} from "antd/es/table";
import {css} from "@emotion/react";

const {Paragraph} = Typography;

type GamePlayProps = {
    currentPlayerIndex: number;
    players: string[];
    playerScores: number[][];
    onScoreUpdate: (score: number) => void;
    setPlayerScores: (playerScores: number[][]) => void;
};

interface DataType {
    key: string;
}

const GamePlay: FC<GamePlayProps> = ({
                                         currentPlayerIndex,
                                         players,
                                         playerScores,
                                         onScoreUpdate,
                                         setPlayerScores,
                                     }) => {
    const [scoreInput, setScoreInput] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const inputRef = useRef(null);
    const tableBodyRef = useRef(null);

    const isValidScore = (score: number) => {
        return score === 0 || (score >= 350 && score % 50 === 0);
    };

    const handleScoreSubmit = () => {
        if (scoreInput && isValidScore(Number(scoreInput))) {
            onScoreUpdate(Number(scoreInput));
            setScoreInput('');
            setShowTooltip(false); // hide tooltip when input is valid
        } else {
            setShowTooltip(true); // show tooltip on invalid input
        }
        inputRef.current?.focus();
        scrollToBottom();
    };

    const handleScoreChange = (newScore: string, key: string, idx: number) => {
        // error handling for invalid input
        if (!newScore) {
            return;
        }
        if (!isValidScore(parseInt(newScore, 10))) {
            return;
        }

        const rowIndex = parseInt(key, 10);
        const updatedScores = [...playerScores];
        updatedScores[rowIndex][idx] = parseInt(newScore, 10);
        setPlayerScores(updatedScores);
    };

    const handleMiss = () => {
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

    const currentPlayerHighlight = css`
      display: inline-block;
      position: relative;
      transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);

      animation: bouncyJump 1.2s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);

      @keyframes bouncyJump {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
          color: royalblue;
        }
        30% {
          transform: translateY(-10px) rotate(-5deg);
          color: crimson;
        }
        50% {
          transform: translateY(0) rotate(0deg);
          color: royalblue;
        }
        70% {
          transform: translateY(-10px) rotate(5deg);
          color: crimson;
        }
      }
    `;

    const columns: ColumnsType<DataType> = [
        {
            dataIndex: 'key',
            width: '50px',
            key: 'key',
            rowScope: 'row',
        },
        ...players.map<DataType>((player, idx) => ({
            dataIndex: `player${idx}`,
            key: `player${idx}`,
            title: () => idx === currentPlayerIndex ? <span css={currentPlayerHighlight}>{player}</span> : player,
            render: (score: number, record: DataType) => (
                score != null ?
                    <Paragraph
                        editable={{
                            text: score.toString(),
                            onChange: (newScore) => handleScoreChange(newScore, record.key, idx),
                            triggerType: ['text']
                        }}
                        inputMode={'numeric'}
                    >
                        {score}
                    </Paragraph>
                    : ''
            ),
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
