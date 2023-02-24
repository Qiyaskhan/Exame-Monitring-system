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

const Recent = ({route}) => {
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

    fetch(ipAddress + 'getRecentList', requestOptions)
      .then(response => response.json())
      .then(e => setdata(e))
      .catch(error => console.log('error', error));
  }, []);

  const [fileName, setfilename] = useState('');
  const [parentName, setparentName] = useState('');
  const [InFolder, setInFolder] = useState('');

  const [type, setType] = useState('');

  function onShowModel(FileName, InFolder, ParentName) {
    setfilename(FileName);
    setparentName(ParentName);
    setInFolder(InFolder);
    FileName.includes('.jpg') ? setType('Image') : null;
    FileName.includes('.png') ? setType('Image') : null;
    FileName.includes('jpeg') ? setType('Image') : null;
    FileName.includes('.mp4') ? setType('Video') : null;
    FileName.includes('.mpeg') ? setType('Video') : null;
    FileName.includes('.pdf') ? setType('PDF') : null;
    showModal();
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
                  <List.Item
                    title={item.FileName}
                    onPress={() =>
                      onShowModel(item.FileName, item.InFolder, item.ParentName)
                    }
                  />
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
                      uri:
                        ipAddress +
                        'getRecentFile/' +
                        fileName +
                        '/' +
                        parentName +
                        '/' +
                        Email,
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
                      uri:
                        ipAddress +
                        'getRecentFile/' +
                        fileName +
                        '/' +
                        parentName +
                        '/' +
                        Email,
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
                      uri:
                        ipAddress +
                        'getRecentFile/' +
                        fileName +
                        '/' +
                        parentName +
                        '/' +
                        Email,
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

export default Recent;
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
