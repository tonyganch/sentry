import styled from '@emotion/styled';
import {useTheme, ThemeProvider} from '@emotion/react';
import {darkTheme, lightTheme, Theme} from 'app/utils/theme';

import space from 'app/styles/space';

import {createContext, ReactChild, useState} from 'react';

import {IconMoon} from 'app/icons';

type ThemeName = 'dark' | 'light';

type Props = {
  children?: ReactChild;
  showThemeSwitcher?: boolean;
  noBorder?: boolean;
};

export const ThemeContext = createContext<ThemeName>('light');

const Sample = ({children, showThemeSwitcher = false, noBorder = false}: Props) => {
  const [theme, setTheme] = useState<ThemeName>('light');
  let themeObject: Theme;

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  if (showThemeSwitcher) {
    themeObject = theme === 'light' ? lightTheme : darkTheme;
  } else {
    themeObject = useTheme();
  }

  return (
    <Wrap>
      {showThemeSwitcher && (
        <ThemeSwitcher>
          <ThemeSwitcherButton onClick={() => toggleTheme()} active={theme === 'dark'}>
            <IconMoon />
          </ThemeSwitcherButton>
        </ThemeSwitcher>
      )}
      <ThemeProvider theme={themeObject}>
        <InnerWrap noBorder={noBorder} increaseMarginTop={showThemeSwitcher}>
          <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
        </InnerWrap>
      </ThemeProvider>
    </Wrap>
  );
};

export default Sample;

const Wrap = styled.div`
  position: relative;
`;

const InnerWrap = styled('div')<{noBorder: boolean; increaseMarginTop: boolean}>`
  position: relative;
  border-radius: ${p => p.theme.borderRadius};
  margin: ${space(2)} 0;

  ${p =>
    !p.noBorder &&
    `
    border: solid 1px ${p.theme.border};
    background: ${p.theme.background};
    padding: ${space(2)} ${space(2)};
    `}
  ${p =>
    p.increaseMarginTop && `margin-top: calc(${space(4)} + ${space(4)} + ${space(2)});`}

  & > *:first-of-type {
    margin-top: 0;
  }

  & > *:last-of-type {
    margin-bottom: 0;
  }

  // Reset text color that was set globally
  // in previewGlobalStyles.tsx
  div,
  p,
  a,
  button {
    color: ${p => p.theme.textColor};
  }
`;

const ThemeSwitcher = styled.div`
  position: absolute;
  top: 0;
  right: ${space(0.5)};
  transform: translateY(-100%);
  border-radius: ${p => p.theme.borderRadius};
  z-index: 1;
`;

const ThemeSwitcherButton = styled.button<{active: boolean}>`
  position: relative;
  background-color: transparent;
  border: none;
  border-radius: ${p => p.theme.borderRadius};
  display: flex;
  align-items: center;
  padding: ${space(1)};
  margin-bottom: ${space(0.5)};
  color: ${p => p.theme.gray300};

  &:hover {
    background: ${p => p.theme.gray100};
    color: ${p => p.theme.gray500};
  }
  ${p =>
    p.active &&
    `
    &,
    &:hover {
      color: ${p.theme.gray500};
    }
    `}
`;
