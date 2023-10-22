import {FC, useRef} from 'react'; // 1. Import useRef
import {Avatar, Button, Input, List, Space} from "antd";
import {UserAddOutlined} from "@ant-design/icons";

type PlayerCreationProps = {
    players: string[];
    currentPlayer: string;
    onAddPlayer: () => void;
    onPlayerNameChange: (name: string) => void;
    onStartGame: () => void;
};

const PlayerCreation: FC<PlayerCreationProps> =
    ({
         players,
         currentPlayer,
         onAddPlayer,
         onPlayerNameChange,
         onStartGame,
     }) => {
        const inputRef = useRef(null); // 2. Create a reference

        const handleAddPlayer = () => {
            onAddPlayer();
            inputRef.current && inputRef.current.focus(); // 4. Use the reference to focus the input
        };

        return (
            <Space size={"small"} direction={"vertical"}>
                <Space.Compact style={{width: '100%'}}>
                    <Input
                        type="text"
                        value={currentPlayer}
                        onChange={(e) => onPlayerNameChange(e.target.value)}
                        autoComplete="off"
                        placeholder="Name"
                        ref={inputRef} // 3. Attach the reference to the <Input> component
                    />
                    <Button type="primary" onClick={handleAddPlayer}><UserAddOutlined/></Button>
                </Space.Compact>

                {players.length > 0 && (
                    <>
                        <List bordered
                              dataSource={players}
                              renderItem={(item, index) => (
                                  <List.Item>
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
