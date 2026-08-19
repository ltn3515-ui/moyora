import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body.custom-cursor-active,
  body.custom-cursor-active * {
    cursor: none !important;
  }

  html, body {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.base};
    background: #E6DFD3;
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    word-break: keep-all;
  }

  ul, ol {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
    color: inherit;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
    background: none;
    color: inherit;
  }

  img {
    display: block;
    max-width: 100%;
  }

  svg {
    display: block;
  }

  /* 범용 마우스 호버 툴팁 */
  [data-tooltip] {
    position: relative;
  }

  [data-tooltip]::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.85);
    padding: 6px 12px;
    background: rgba(38, 38, 44, 0.95);
    color: #FFF;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
    border-radius: 6px;
    pointer-events: none;
    opacity: 0;
    transition: all 0.18s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  [data-tooltip]::after {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%) scale(0.85);
    border-width: 6px 6px 0;
    border-style: solid;
    border-color: rgba(38, 38, 44, 0.95) transparent transparent;
    pointer-events: none;
    opacity: 0;
    transition: all 0.18s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 100;
  }

  [data-tooltip]:hover::before,
  [data-tooltip]:hover::after {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;
