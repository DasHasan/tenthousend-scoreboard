import {useState} from 'react';

const styles = {
    emojiIcon: {
        display: 'inline-block',
        fontSize: '24px',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
    },
    emojiIconHover: {
        display: 'inline-block',
        fontSize: '24px',
        transition: 'transform 0.3s ease',
        transform: 'rotate(360deg)',
        cursor: 'pointer',
    },
};

const EmojiIcon = ({emoji}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            style={isHovered ? styles.emojiIconHover : styles.emojiIcon}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
      {emoji}
    </span>
    );
};

export default EmojiIcon;
