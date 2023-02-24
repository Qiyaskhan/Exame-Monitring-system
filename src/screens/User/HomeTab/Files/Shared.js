import {View, FlatList, Image, StyleSheet} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import ipAddress from '../../../../components/api';
import {
  Button,
  List,
  Modal,
  Portal,
  Provider,
  Divider,
  FAB,
} from 'react-native-paper';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';

const Shared = ({route}) => {
  Email = route.params.Email;

  // UseRef For Video
  const videoPlayer = useRef();

  // To Store State If Something Changes In App
  let [yes, setyes] = useState(false);

  //Model
  const [visible2, setVisible2] = useState(false);
  const showModal = () => setVisible2(true);
  const hideModal = () => setVisible2(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  };

  const [data, setdata] = useState([]);

  useEffect(() => {
    var formdata = new FormData();
    formdata.append('Email', Email);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch(ipAddress + 'getSharedData', requestOptions)
      .then(response => response.json())
      .then(e => setdata(e))
      .catch(error => console.log('error', error));
  }, []);

  const [myItem, setMyItem] = useState('');

  const [type, setType] = useState('');

  function onShowModel(item) {
    setMyItem(item);
    item.includes('.jpg') ? setType('Image') : null;
    item.includes('.png') ? setType('Image') : null;
    item.includes('jpeg') ? setType('Image') : null;
    item.includes('.mp4') ? setType('Video') : null;
    item.includes('.mpeg') ? setType('Video') : null;
    item.includes('.pdf') ? setType('PDF') : null;
    showModal();
  }

  function isFile(item) {
    return item.includes('.') ? true : false;
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 7,
          justifyContent: 'flex-start',
          borderTopWidth: 1,
          borderTopColor: 'gray',
        }}>
        <List.Section title={Name}>
          <FlatList
            data={data}
            renderItem={({item}) => {
              return (
                <View>
                  {!isFile(item) ? (
                    <List.Accordion
                      title={item}
                      left={props => (
                        <List.Icon icon="folder" />
                      )}></List.Accordion>
                  ) : (
                    <List.Item title={item} onPress={() => onShowModel(item)} />
                  )}
                </View>
              );
            }}
          />
        </List.Section>

        {/* FAB For More Options */}

        <FAB
          icon="refresh"
          style={styles.fab}
          onPress={() => (yes ? setyes(false) : setyes(true))}
        />

        <Provider>
          <Portal>
            <Modal
              visible={visible2}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}>
              <View>
                {type == 'Image' ? (
                  <Image
                    source={{
                      uri: ipAddress + 'getSFile/' + myItem + '/' + Email,
                    }}
                    style={{
                      width: '100%',
                      height: '80%',
                    }}
                    resizeMode={'contain'}
                  />
                ) : null}

                {type == 'Video' ? (
                  <Video
                    ref={ref => (videoPlayer.current = ref)}
                    source={{
                      uri: ipAddress + 'getSFile/' + myItem + '/' + Email,
                    }}
                    controls={true}
                    muted={true}
                    resizeMode={'contain'}
                    style={{
                      width: '100%',
                      height: '80%',
                    }}
                  />
                ) : null}
                {type == 'PDF' ? (
                  <Pdf
                    source={{
                      uri: ipAddress + 'getSFile/' + myItem + '/' + Email,
                    }}
                    trustAllCerts={false}
                    style={{width: '100%', height: '80%'}}
                  />
                ) : null}
                <Divider />
                <Button
                  style={{marginLeft: 10, marginTop: 10}}
                  mode="contained"
                  onPress={hideModal}>
                  Go Back
                </Button>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </View>
    </View>
  );
};

export default Shared;
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
