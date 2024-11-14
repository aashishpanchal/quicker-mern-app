import type {NativeStackScreenProps} from '@react-navigation/native-stack';

/** Root Stack Navigation Params List */
export type RootStackParamList = {
  home: undefined;
  splash: undefined;
};

/** Root Stack Scree Props */
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
