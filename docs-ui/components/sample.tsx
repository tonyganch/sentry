import styled from '@emotion/styled';
import {useTheme, ThemeProvider} from '@emotion/react';
import {darkTheme, lightTheme, Theme} from 'app/utils/theme';

import space from 'app/styles/space';

import {createContext, ReactChild, useState} from 'react';

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

  if (showThemeSwitcher) {
    themeObject = theme === 'light' ? lightTheme : darkTheme;
  } else {
    themeObject = useTheme();
  }

  return (
    <Wrap>
      {showThemeSwitcher && (
        <ThemeSwitcher>
          <ThemeSwitcherButton
            active={theme === 'light'}
            onClick={() => setTheme('light')}
          >
            Light
            <ThemeSwitcherLine active={theme === 'light'} noBorder={noBorder} />
          </ThemeSwitcherButton>
          <ThemeSwitcherButton active={theme === 'dark'} onClick={() => setTheme('dark')}>
            Dark
            <ThemeSwitcherLine active={theme === 'dark'} noBorder={noBorder} />
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

const Wrap = styled.div`
  position: relative;
`;

const InnerWrap = styled('div')<{noBorder: boolean; increaseMarginTop: boolean}>`
  position: relative;
  border-radius: ${p => p.theme.borderRadius};
  margin: ${space(2)} 0;

  ${p => !p.noBorder && `border: solid 1px ${p.theme.border};`}
  ${p => !p.noBorder && `background: ${p.theme.background};`}
  ${p =>
    !p.noBorder ? `padding: ${space(2)} ${space(2)};` : `padding-top: ${space(1)};`}
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
  left: 50%;
  transform: translate(-50%, -100%);
  border-radius: ${p => p.theme.borderRadius};
  z-index: 1;
`;

const ThemeSwitcherButton = styled.button<{active: boolean}>`
  position: relative;
  background-color: transparent;
  border: none;
  padding: ${space(1)} ${space(2)};

  color: ${p => (p.active ? p.theme.purple300 : p.theme.subText)};
  font-weight: 600;
`;

const ThemeSwitcherLine = styled.div<{active: boolean; noBorder: boolean}>`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;

  ${p =>
    p.noBorder
      ? `background: ${p.active ? p.theme.purple300 : p.theme.border}`
      : `background: ${p.active ? p.theme.purple300 : 'transparent'};`}
  ${p => !p.noBorder && `border-radius: 3px 3px 0 0;`}
`;

export default Sample;
