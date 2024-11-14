import {useNavTheme} from '@/hooks/nav-theme';
import StackNavigator from './stack-navigator';
import {NavigationContainer} from '@react-navigation/native';

/** root app navigation */
export const Navigation = () => {
  const theme = useNavTheme();

  console.log(theme);

  return (
    <NavigationContainer theme={theme}>
      <StackNavigator />
    </NavigationContainer>
  );
};
