/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const emojiIconStyle = css`
  display: inline-block;
  font-size: xxx-large;
  transition: transform 0.3s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: rotate(360deg);
  }
`;

const EmojiIcon = ({ emoji }) => {
    return <span css={emojiIconStyle}>{emoji}</span>;
};

export default EmojiIcon;
