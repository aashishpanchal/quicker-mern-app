import type {RootStackParamList} from '@/types/navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// screens
import Home from '@/screens/home';
import Splash from '@/screens/splash';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** app stack navigator */
export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="splash" component={Splash} />
    </Stack.Navigator>
  );
}
