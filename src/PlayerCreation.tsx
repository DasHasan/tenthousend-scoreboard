import {FC, useRef} from 'react';
import {Avatar, Button, Input, List, Space} from "antd";
import {UserAddOutlined, DeleteOutlined} from "@ant-design/icons";

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

        return (
            <Space size={"small"} direction={"vertical"}>
                <Space style={{width: '100%'}}>
                    <Input
                        type="text"
                        value={currentPlayer}
                        onChange={(e) => onPlayerNameChange(e.target.value)}
                        autoComplete="off"
                        placeholder="Name"
                        ref={inputRef}
                    />
                    <Button type="primary" onClick={handleAddPlayer}><UserAddOutlined/></Button>
                </Space>

                {players.length > 0 && (
                    <>
                        <List bordered
                              dataSource={players}
                              renderItem={(item, index) => (
                                  <List.Item actions={[
                                      <DeleteOutlined onClick={() => onRemovePlayer(index)} />
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
        );
    };

export default PlayerCreation;
