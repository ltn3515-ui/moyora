export const theme = {
  colors: {
    yellow: '#FEDD13',
    yellowDark: '#F2CE00',
    yellowLight: '#FFF1A8',
    pink: '#F491BC',
    pinkLight: '#FBD3E3',
    blue: '#8FC7E8',
    blueLight: '#CDE7F5',
    green: '#8FCB9B',
    greenLight: '#D8F0DD',
    cream: '#D8B98B',
    creamLight: '#F3E4CE',
    gray: '#B7B0A3',
    grayLight: '#E9E6DE',
    text: '#26262C',
    textSub: '#8A8A93',
    textLight: '#B4B4BC',
    white: '#FFFFFF',
    bg: '#FFFBF3',
    bgCard: '#FFFFFF',
    border: '#F0EAE0',
    black: '#1C1C1E',
  },
  layout: {
    maxWidth: '480px',
    headerHeight: '56px',
    bottomNavHeight: '72px',
  },
  radius: {
    sm: '10px',
    md: '16px',
    lg: '22px',
    xl: '28px',
    round: '999px',
  },
  spacing: {
    space1: '4px',
    space2: '8px',
    space3: '12px',
    space4: '20px',
    space5: '24px',
    space6: '28px',
    space7: '32px',
  },
  shadows: {
    card: '0 4px 14px rgba(38, 38, 44, 0.06)',
    float: '0 8px 20px rgba(38, 38, 44, 0.18)',
  },
  fonts: {
    base: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  }
};

export type ThemeType = typeof theme;
