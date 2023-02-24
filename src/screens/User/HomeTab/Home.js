import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  FAB,
  Modal,
  Portal,
  Provider,
  Button,
  Divider,
} from 'react-native-paper';
import Shared from './Files/Shared';
import Starred from './Files/Starred';
import Recent from './Files/Recent';
import ipAddress from '../../../components/api';

{
  /* Actions  */
}
import TakePhotos from './TakePhotos';
import RecordVideos from './RecordVideos';
import ShareFiles from './ShareFiles';

const Tab = createMaterialTopTabNavigator();

export default HomeScreen = ({route}) => {
  Email = route.params.Email;
  Name = route.params.Name;

  // Fab Drawer
  const [visible2, setVisible2] = useState(false);
  const showModal = () => setVisible2(true);
  const hideModal = () => setVisible2(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  };

  // Fab Drawer
  const [visible3, setVisible3] = useState(false);
  const showModal3 = () => setVisible3(true);
  const hideModal3 = () => setVisible3(false);

  // // Notification
  // useEffect(() => {
  //   let timer = setInterval(() => {
  //     fetch(ipAddress + 'recieveNotification/' + Email)
  //       .then(response => response.json())
  //       .then(json => {
  //         if (json == 'True') {
  //           showModal3();
  //         }
  //       });
  //   }, 10000);

  //   return () => clearInterval(timer);
  // }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 10,
          justifyContent: 'flex-start',
        }}>
        <NavigationContainer independent={true}>
          <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen
              name="Shared"
              component={Shared}
              initialParams={{Email}}
            />
            <Tab.Screen
              name="Starred"
              component={Starred}
              initialParams={{Email}}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>

      {/* FAB For More Options */}

      <FAB icon="plus" style={styles.fab} onPress={showModal} />

      {/* Modal With Options */}
      <Provider>
        <Portal>
          <Modal
            visible={visible2}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <Text>Add to Dropbox Replica</Text>
            <View style={{marginTop: 10}}>
              <Button
                icon="layers"
                style={{marginLeft: 10, marginTop: 10}}
                mode="contained"
                onPress={() => ShareFiles(Email)}>
                Upload Files
              </Button>
              <Divider />
              <Button
                icon="camera"
                style={{marginLeft: 10, marginTop: 10}}
                mode="contained"
                onPress={() => TakePhotos(Email)}>
                Take Photos
              </Button>
              <Button
                icon="camera"
                style={{marginLeft: 10, marginTop: 10}}
                mode="contained"
                onPress={() => RecordVideos(Email)}>
                Record Videos
              </Button>
            </View>
          </Modal>
        </Portal>
      </Provider>

      {/* Modal With Options */}
      <Provider>
        <Portal>
          <Modal
            visible={visible3}
            onDismiss={hideModal3}
            contentContainerStyle={containerStyle}>
            <Text>SomeOne Shared A File</Text>
          </Modal>
        </Portal>
      </Provider>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
