import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LogBox} from 'react-native';
import HomeScreen from './User/HomeTab/Home';
import AccountScreen from './User/AccountTab/Account';
import FilesScreen from './User/FilesTab/Files';

const Tab = createBottomTabNavigator();

const TabNavigationRoutings = ({route}) => {
  LogBox.ignoreAllLogs(true);
  Email = route.params.Email;
  Name = route.params.Name;

  const [yes, setyes] = useState(true);

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home-outline' : 'home-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person-outline' : 'person-outline';
            } else if (route.name === 'Files') {
              iconName = focused ? 'folder-outline' : 'folder-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{Email, Name}}
        />
        <Tab.Screen
          name="Files"
          component={FilesScreen}
          initialParams={{Email, Name}}
        />

        <Tab.Screen
          name="Account"
          component={AccountScreen}
          initialParams={{Email, Name, yes}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigationRoutings;
