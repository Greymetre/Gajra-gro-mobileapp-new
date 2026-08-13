import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import {useEffect} from 'react';
import {isUserLoggedIn} from '../services/auth_helper';
import BottomTab from './BottomTab';
import { Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export const Router = () => {
  const data = useSelector((state: ApplicationState) => state.stackReducer);
  console.log(data);

  // const stateData = useSelector((state: ApplicationState) => state);
  // console.log(data);
  useEffect(() => {
    console.log('Data Store >>>    ', data);
    // console.log('Data Store >>>    ', stateData.loginReducers);
  }, []);

  return (
    <>
    <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : data == 'auth' ? 0 :  useSafeAreaInsets()?.top , backgroundColor:'white'}} edges={['top']}>
      <Stack.Navigator
        screenOptions={{
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeOutToBottomAndroidSpec,
          },
          headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
        }}
        // initialRouteName={'PinLocked'}
        defaultScreenOptions={{
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeInFromBottomAndroidSpec,
          },
          headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
        }}>
        {data == 'auth' ? AuthStack(Stack) : MainStack(Stack)}
        {/* {!isUserLoggedIn ? AuthStack(Stack) : MainStack(Stack)} */}
        {/* {!isUserLoggedIn ? MainStack(Stack) : AuthStack(Stack)} */}
      </Stack.Navigator>
    </SafeAreaView>
    </>
  );
};
