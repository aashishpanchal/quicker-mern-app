import {Theme} from './theme';
import {UnistylesRegistry} from 'react-native-unistyles';

// register themes
UnistylesRegistry.addThemes({light: Theme});

// define app theme
type AppThemes = {
  light: typeof Theme;
};

// override library types
declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}
