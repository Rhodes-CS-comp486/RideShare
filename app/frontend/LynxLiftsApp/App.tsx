import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

const App = () => {
  return React.createElement(
    NavigationContainer,
    null,
    React.createElement(
      Stack.Navigator,
      null,
      React.createElement(Stack.Screen, { name: 'Register', component: RegisterScreen })
    )
  );
};

export default App;
