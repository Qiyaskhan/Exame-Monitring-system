import 'react-native-gesture-handler';
import * as React from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import AdminScreen from './src/screens/Admin/AdminScreen';
import MyComponent from './src/screens/MyComponent';

{
  /* Tab Navigation Routes */
}

import TabNavigationRoutings from './src/screens/TabNavigationRoutings';

{
  /* Files Screens */
}
import Files from './src/screens/User/FilesTab/Files';

const Stack = createNativeStackNavigator();

const App = () => {
  LogBox.ignoreAllLogs(true);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Routings" component={TabNavigationRoutings} />
        <Stack.Screen name="MyComponent" component={MyComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const FilesScreenNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Files"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Files" component={Files} />
    </Stack.Navigator>
  );
};

export {FilesScreenNavigator};

const LogoutScreenNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={login} />
    </Stack.Navigator>
  );
};

export {LogoutScreenNavigator};

export default App;
