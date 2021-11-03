import Sample, {SampleThemeContext} from 'docs-ui/components/sample';
import ColorSwatch from './colorSwatch';
import styled from '@emotion/styled';
import space from 'app/styles/space';

import {useContext} from 'react';

type ColorDefinition = {
  name: string;
  lightValue: string;
  darkValue: string;
};

type ColorGroup = {
  id: string;
  useFor: string;
  colors: ColorDefinition[];
};

const Wrap = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16em, 1fr));
  grid-gap: ${space(2)};

  & > * {
    grid-column-end: span 1;
  }
`;

const ColorTable = ({colorGroups}: {colorGroups: ColorGroup[]}) => {
  const theme = useContext(SampleThemeContext);

  return (
    <Wrap>
      {colorGroups.map(group => {
        return <ColorSwatch key={group.id} colors={group.colors} theme={theme} />;
      })}
    </Wrap>
  );
};

const neutralColors: ColorGroup[] = [
  {
    id: 'gray500',
    useFor: 'Headings, button labels, tags/badges, and alerts.',
    colors: [
      {
        name: 'Gray 500',
        lightValue: '#2B2233',
        darkValue: '#EBE6EF',
      },
    ],
  },
  {
    id: 'gray400',
    useFor: 'Body text, input values & labels, ',
    colors: [
      {
        name: 'Gray 400',
        lightValue: '#4D4158',
        darkValue: '#D6D0DC',
      },
    ],
  },
  {
    id: 'gray300',
    useFor:
      'Input placeholders, inactive/disabled inputs and buttons, chart labels, supplemental and non-essential text.',
    colors: [
      {
        name: 'Gray 300',
        lightValue: '#80708F',
        darkValue: '#998DA5',
      },
    ],
  },
  {
    id: 'gray200',
    useFor: 'Outer borders.',
    colors: [
      {
        name: 'Gray 200',
        lightValue: '#DBD6E1',
        darkValue: '#43384C',
      },
    ],
  },
  {
    id: 'gray100',
    useFor: 'Inner borders and dividers.',
    colors: [
      {
        name: 'Gray 100',
        lightValue: '#EBE6EF',
        darkValue: '#342B3B',
      },
    ],
  },
];

const accentColors: ColorGroup[] = [
  {
    id: 'purple',
    useFor: 'Branding, active/focus states.',
    colors: [
      {
        name: 'Purple 300',
        lightValue: 'rgba(108, 95, 199, 1)',
        darkValue: 'rgba(118, 105, 211, 1)',
      },
      {
        name: 'Purple 200',
        lightValue: 'rgba(108, 95, 199, 0.5)',
        darkValue: 'rgba(118, 105, 211, 0.4)',
      },
      {
        name: 'Purple 100',
        lightValue: 'rgba(108, 95, 199, 0.1)',
        darkValue: 'rgba(118, 105, 211, 0.06)',
      },
    ],
  },
  {
    id: 'blue',
    useFor: 'Links, informational alerts.',
    colors: [
      {
        name: 'Blue 300',
        lightValue: 'rgba(61, 116, 219, 1)',
        darkValue: 'rgba(92, 149, 255, 1)',
      },
      {
        name: 'Blue 200',
        lightValue: 'rgba(61, 116, 219, 0.5)',
        darkValue: 'rgba(92, 149, 255, 0.4)',
      },
      {
        name: 'Blue 100',
        lightValue: 'rgba(61, 116, 219, 0.1)',
        darkValue: 'rgba(92, 149, 255, 0.06)',
      },
    ],
  },
  {
    id: 'green',
    useFor: 'Communicating success, resolution, approval, availability, or creation.',
    colors: [
      {
        name: 'Green 300',
        lightValue: 'rgba(43, 161, 133, 1)',
        darkValue: 'rgba(42, 200, 163, 1)',
      },
      {
        name: 'Green 200',
        lightValue: 'rgba(43, 161, 133, 0.5)',
        darkValue: 'rgba(42, 200, 163, 0.4)',
      },
      {
        name: 'Green 100',
        lightValue: 'rgba(43, 161, 133, 0.1)',
        darkValue: 'rgba(42, 200, 163, 0.06)',
      },
    ],
  },
  {
    id: 'yellow',
    useFor: 'Communicating warnings, missing, or impeded progress.',
    colors: [
      {
        name: 'Yellow 300',
        lightValue: 'rgba(245, 176, 0, 1)',
        darkValue: 'rgba(255, 194, 39, 1)',
      },
      {
        name: 'Yellow 200',
        lightValue: 'rgba(245, 176, 0, 0.5)',
        darkValue: 'rgba(255, 194, 39, 0.4)',
      },
      {
        name: 'Yellow 100',
        lightValue: 'rgba(245, 176, 0, 0.1)',
        darkValue: 'rgba(255, 194, 39, 0.06)',
      },
    ],
  },
  {
    id: 'red',
    useFor: 'Communicating fatal errorrs, deletion, removal, or declines.',
    colors: [
      {
        name: 'Red 300',
        lightValue: 'rgba(245, 84, 89, 1)',
        darkValue: 'rgba(250, 79, 84, 1)',
      },
      {
        name: 'Red 200',
        lightValue: 'rgba(245, 84, 89, 0.5)',
        darkValue: 'rgba(250, 79, 84, 0.4)',
      },
      {
        name: 'Red 100',
        lightValue: 'rgba(245, 84, 89, 0.1)',
        darkValue: 'rgba(250, 79, 84, 0.06)',
      },
    ],
  },
  {
    id: 'Pink',
    useFor: 'Communicating freshness, new features, or promotions.',
    colors: [
      {
        name: 'Pink 300',
        lightValue: 'rgba(239, 77, 121, 1)',
        darkValue: 'rgba(250, 76, 124, 1)',
      },
      {
        name: 'Pink 200',
        lightValue: 'rgba(239, 77, 121, 0.5)',
        darkValue: 'rgba(250, 76, 124, 0.4)',
      },
      {
        name: 'Pink 100',
        lightValue: 'rgba(239, 77, 121, 0.1)',
        darkValue: 'rgba(250, 76, 124, 0.06)',
      },
    ],
  },
];

export const NeutralTable = () => (
  <Sample showThemeSwitcher>
    <ColorTable colorGroups={neutralColors} />
  </Sample>
);
export const AccentTable = () => (
  <Sample showThemeSwitcher>
    <ColorTable colorGroups={accentColors} />
  </Sample>
);
