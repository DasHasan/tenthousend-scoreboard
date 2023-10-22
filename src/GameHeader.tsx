import {FC} from 'react';
import {GameState} from './GameState';
import EmojiIcon from "./EmojiIcon";

type GameHeaderProps = {
    gameState: GameState;
};

const GameHeader: FC<GameHeaderProps> = ({gameState}) => {
    if (gameState === 'STARTED') return null;
    return <h1>
        <EmojiIcon emoji="🎲"/>
        <EmojiIcon emoji="🎲"/>
        <EmojiIcon emoji="🎲"/>
        <EmojiIcon emoji="🎲"/>
        <EmojiIcon emoji="🎲"/>
        <EmojiIcon emoji="🎲"/>
    </h1>;
};

export default GameHeader;
