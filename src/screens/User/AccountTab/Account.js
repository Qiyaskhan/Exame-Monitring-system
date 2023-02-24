import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Dimensions,
  DrawerLayoutAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import Drawer from '../../Drawer';

export default AccountScreen = ({route, navigation}) => {
  Email = route.params.Email;
  Name = route.params.Name;

  const drawer = useRef(null);
  return (
    <SafeAreaView style={{flex: 1}}>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        renderNavigationView={Drawer}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name={'menu-outline'}
            size={30}
            style={{marginLeft: 10}}
            onPress={() => drawer.current.openDrawer()}
          />
          <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 30}}>
            PERSONAL
          </Text>
        </View>

        <View style={{flex: 15, margin: 20}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <Image
              style={{borderRadius: 50, width: 40, height: 40}}
              source={require('../../../../assets/profile.png')}
            />
            <View style={{marginLeft: 10}}>
              <Text
                style={{fontWeight: 'bold', fontSize: 16}}
                onPress={() => console.log('Pressed')}>
                {Name}
              </Text>
              <Text style={{fontSize: 16}}>Dropbox Replica</Text>
            </View>
          </View>

          <View style={{flex: 10, justifyContent: 'flex-start'}}>
            <Text>Details</Text>
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Email</Text>
                <Text style={{fontSize: 16}}>{Email}</Text>
              </TouchableOpacity>
              <Button style={{color: 'red'}} mode="text" onPress={() => {}}>
                Sign out of dropbox
              </Button>
            </View>
          </View>
        </View>
      </DrawerLayoutAndroid>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({});
