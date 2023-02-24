import React, {useRef, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {Button, ProgressBar} from 'react-native-paper';
const Drawer = () => {
  return (
    <View style={[styles.container]}>
      <Image
        style={{borderRadius: 50, width: 80, height: 80, alignSelf: 'center'}}
        source={require('../../assets/profile.png')}
      />
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          marginTop: 10,
          textAlign: 'center',
        }}>
        Demo
      </Text>
      <Text style={{fontSize: 16, marginTop: 5}}>Demo@gmail.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Drawer;

{
  /* Drawer Implementation On Screens */
}

// import React, {useRef} from 'react';

// import {
//   SafeAreaView,
//   DrawerLayoutAndroid,
// } from 'react-native';

// Const Demo = () => {
// const drawer = useRef(null);
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <DrawerLayoutAndroid
//         ref={drawer}
//         drawerWidth={300}
//         renderNavigationView={Drawer}>
//       </DrawerLayoutAndroid>
//     </SafeAreaView>
//   );
// };
