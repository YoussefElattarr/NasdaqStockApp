import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ExploreScreen from './screens/ExploreScreen';
import {Provider} from 'react-redux';
import setupStore from './redux/store';
import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  return (
    <Provider store={setupStore({})}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Explore">
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
              headerTitle: 'Nasdaq',
              headerStyle: {
                backgroundColor: '#191927',
              },
              headerTitleStyle: {
                color: '#fff',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
