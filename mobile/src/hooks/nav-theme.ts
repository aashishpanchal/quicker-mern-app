import deepmerge from 'deepmerge';
import {useStyles} from 'react-native-unistyles';
import {DefaultTheme} from '@react-navigation/native';

export const useNavTheme = () => {
  const {theme} = useStyles();
  // override exit default theme
  return deepmerge(DefaultTheme, {
    colors: {
      text: theme.colors.text,
      background: theme.colors.bg,
      primary: theme.colors.primary,
    },
  });
};
