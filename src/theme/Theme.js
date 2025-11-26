import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import { COLORS } from './Colors';

const THEME = {
  Light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      black: COLORS.black,
      white: COLORS.white,
      turquoise: COLORS.turquoise,
    },
  },
  Dark: { 
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      black: COLORS.black,
      white: COLORS.white,
      turquoise: COLORS.turquoise,
    },
  },
};

export default THEME;
