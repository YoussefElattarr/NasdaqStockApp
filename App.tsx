import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ExploreScreen from './screens/ExploreScreen';
import {Provider} from 'react-redux';
import store from './redux/store';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Explore">
          {/* <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} /> */}
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
