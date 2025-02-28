import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';
import FeedScreen from './screens/FeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';

const Stack = createStackNavigator();

// const App = () => {
//   return React.createElement(
//     NavigationContainer,
//     null,
//     React.createElement(
//       Stack.Navigator,
//       null,
//       //React.createElement(Stack.Screen, { name: 'Register', component: RegisterScreen }),
//       React.createElement(Stack.Screen, { name: 'Feed', component: FeedScreen})
//     )
//   );
// };

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
