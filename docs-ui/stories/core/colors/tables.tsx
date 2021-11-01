import styled from '@emotion/styled';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'docs-ui/components/table';
import ColorChip from 'docs-ui/components/colorChip';
import space from 'app/styles/space';
import Sample, {ThemeContext} from 'docs-ui/components/sample';

import {useContext, useEffect} from 'react';

type ColorDefinition = {
  name: string;
  lightValue: string;
  darkValue: string;
  aliases?: string[];
  useFor: string;
};

const ColorValue = styled.code`
  &&& {
    display: inline-block;
    font-size: 0.875rem;
    color: ${p => p.theme.textColor};
    background: ${p => p.theme.backgroundSecondary};
    border-color: ${p => p.theme.innerBorder};
    margin-top: ${space(0.5)};
  }
`;

const ColorName = styled.p`
  color: ${p => p.theme.textColor};
  font-weight: 600;
`;

const Alias = styled.code`
  &&& {
    display: inline-block;
    font-size: 0.875rem;
    margin-top: ${space(1)};
  }
`;

const ColorTable = ({colors}: {colors: ColorDefinition[]}) => {
  const theme = useContext(ThemeContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Color</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Usage</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {colors.map(c => {
          const colorValue = theme === 'light' ? c.lightValue : c.darkValue;

          return (
            <TableRow key={c.name}>
              <TableCell morePadding verticalAlign="top">
                <ColorChip value={colorValue} size="lg" noMargin noText />
              </TableCell>
              <TableCell morePadding verticalAlign="top">
                <ColorName>{c.name}</ColorName>
                <ColorValue>{colorValue}</ColorValue>
              </TableCell>
              {/*
                  <TableCell morePadding verticalAlign="top">
                    {c.aliases?.map((alias, i) => (
                      <Fragment key={i}>
                        <Alias key={i}>{alias}</Alias>
                        <br />
                      </Fragment>
                    ))}
                  </TableCell>
                  */}
              <TableCell morePadding verticalAlign="top">
                {c.useFor}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const neutralColors: ColorDefinition[] = [
  {
    name: 'Gray 500',
    useFor: 'Headings, button labels',
    lightValue: '#2B2233',
    darkValue: '#EBE6EF',
  },
  {
    name: 'Gray 400',
    useFor: 'Body text',
    lightValue: '#4D4158',
    darkValue: '#D6D0DC',
  },
  {
    name: 'Gray 300',
    useFor: 'Placeholders, small labels',
    lightValue: '#80708F',
    darkValue: '#998DA5',
  },
  {
    name: 'Gray 200',
    useFor: 'Lines, borders',
    lightValue: '#DBD6E1',
    darkValue: '#43384C',
  },
  {
    name: 'Gray 100',
    useFor: 'Lines, borders',
    lightValue: '#EBE6EF',
    darkValue: '#342B3B',
  },
];

const accentColors: ColorDefinition[] = [
  {
    name: 'Purple 300',
    useFor: 'Active states – text, background fill',
    lightValue: 'rgba(108, 95, 199, 1)',
    darkValue: 'rgba(118, 105, 211, 1)',
  },
  {
    name: 'Purple 200',
    useFor: 'Active states – borders, outlines',
    lightValue: 'rgba(108, 95, 199, 0.5)',
    darkValue: 'rgba(118, 105, 211, 0.4)',
  },
  {
    name: 'Purple 100',
    useFor: 'Active states – background fill',
    lightValue: 'rgba(108, 95, 199, 0.1)',
    darkValue: 'rgba(118, 105, 211, 0.06)',
  },
  {
    name: 'Blue 300',
    useFor: 'Links - text',
    lightValue: 'rgba(61, 116, 219, 1)',
    darkValue: 'rgba(92, 149, 255, 1)',
  },
  {
    name: 'Blue 200',
    useFor: 'Links – underline',
    lightValue: 'rgba(61, 116, 219, 0.5)',
    darkValue: 'rgba(92, 149, 255, 0.4)',
  },
  {
    name: 'Blue 100',
    useFor: 'Links – background fill',
    lightValue: 'rgba(61, 116, 219, 0.1)',
    darkValue: 'rgba(92, 149, 255, 0.06)',
  },
  {
    name: 'Green 300',
    useFor: 'Success',
    lightValue: 'rgba(43, 161, 133, 1)',
    darkValue: 'rgba(42, 200, 163, 1)',
  },
  {
    name: 'Green 200',
    useFor: 'Success',
    lightValue: 'rgba(43, 161, 133, 0.5)',
    darkValue: 'rgba(42, 200, 163, 0.4)',
  },
  {
    name: 'Green 100',
    useFor: 'Success',
    lightValue: 'rgba(43, 161, 133, 0.1)',
    darkValue: 'rgba(42, 200, 163, 0.06)',
  },
  {
    name: 'Yellow 300',
    useFor: 'Warning',
    lightValue: 'rgba(245, 176, 0, 1)',
    darkValue: 'rgba(255, 194, 39, 1)',
  },
  {
    name: 'Yellow 200',
    useFor: 'Warning',
    lightValue: 'rgba(245, 176, 0, 0.5)',
    darkValue: 'rgba(255, 194, 39, 0.4)',
  },
  {
    name: 'Yellow 100',
    useFor: 'Warning',
    lightValue: 'rgba(245, 176, 0, 0.1)',
    darkValue: 'rgba(255, 194, 39, 0.06)',
  },
  {
    name: 'Red 300',
    useFor: 'Error',
    lightValue: 'rgba(245, 84, 89, 1)',
    darkValue: 'rgba(250, 79, 84, 1)',
  },
  {
    name: 'Red 200',
    useFor: 'Error',
    lightValue: 'rgba(245, 84, 89, 0.5)',
    darkValue: 'rgba(250, 79, 84, 0.4)',
  },
  {
    name: 'Red 100',
    useFor: 'Error',
    lightValue: 'rgba(245, 84, 89, 0.1)',
    darkValue: 'rgba(250, 79, 84, 0.06)',
  },
  {
    name: 'Pink 300',
    useFor: '',
    lightValue: 'rgba(239, 77, 121, 1)',
    darkValue: 'rgba(250, 76, 124, 1)',
  },
  {
    name: 'Pink 200',
    useFor: '',
    lightValue: 'rgba(239, 77, 121, 0.5)',
    darkValue: 'rgba(250, 76, 124, 0.4)',
  },
  {
    name: 'Pink 100',
    useFor: '',
    lightValue: 'rgba(239, 77, 121, 0.1)',
    darkValue: 'rgba(250, 76, 124, 0.06)',
  },
];

export const NeutralTable = () => (
  <Sample showThemeSwitcher noBorder>
    <ColorTable colors={neutralColors} />
  </Sample>
);
export const AccentTable = () => (
  <Sample showThemeSwitcher noBorder>
    <ColorTable colors={accentColors} />
  </Sample>
);
