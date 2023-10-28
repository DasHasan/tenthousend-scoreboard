/** @jsxImportSource @emotion/react */
import {FC, useRef} from 'react';
import {Avatar, Button, Col, Input, List, Row, Space} from "antd";
import {DeleteOutlined, UserAddOutlined} from "@ant-design/icons";
import {css} from "@emotion/react";

type PlayerCreationProps = {
    players: string[];
    currentPlayer: string;
    onAddPlayer: () => void;
    onPlayerNameChange: (name: string) => void;
    onRemovePlayer: (index: number) => void; // Added this line
    onStartGame: () => void;
};

const PlayerCreation: FC<PlayerCreationProps> =
    ({
         players,
         currentPlayer,
         onAddPlayer,
         onPlayerNameChange,
         onRemovePlayer, // Added this line
         onStartGame,
     }) => {
        const inputRef = useRef(null);

        const handleAddPlayer = () => {
            onAddPlayer();
            inputRef.current && inputRef.current.focus();
        };
        const fullWidth = css`
          width: 100%;
        `;
        return (
            <Row>
                <Col xs={{span: 22, offset: 1}} xl={{span: 8, offset: 8}}>
                    <Space size={"small"} direction={"vertical"} css={fullWidth}>
                        <Space.Compact css={fullWidth}>
                            <Input
                                type="text"
                                value={currentPlayer}
                                onChange={(e) => onPlayerNameChange(e.target.value)}
                                autoComplete="off"
                                placeholder="Name"
                                ref={inputRef}
                            />
                            <Button type="primary" onClick={handleAddPlayer}><UserAddOutlined/></Button>
                        </Space.Compact>

                        {players.length > 0 && (
                            <>
                                <List bordered
                                      dataSource={players}
                                      renderItem={(item, index) => (
                                          <List.Item actions={[
                                              <DeleteOutlined onClick={() => onRemovePlayer(index)}/>
                                          ]}>
                                              <List.Item.Meta
                                                  avatar={<Avatar
                                                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>}
                                                  title={item}
                                              />
                                          </List.Item>
                                      )}
                                />
                                <Button onClick={onStartGame}>Start</Button>
                            </>
                        )}
                    </Space>

                </Col>
            </Row>
        );
    };

export default PlayerCreation;
