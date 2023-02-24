import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {
  Button,
  List,
  TextInput,
  Modal,
  Portal,
  Provider,
  Divider,
  Chip,
  FAB,
} from 'react-native-paper';
import ipAddress from '../../../components/api';
import Video from 'react-native-video';
import Pdf from 'react-native-pdf';
import DropDown from 'react-native-paper-dropdown';

export default FilesScreen = ({route}) => {
  Email = route.params.Email;
  Name = route.params.Name;
  yes = route.params.yes;

  // To Store Fodler Name
  const [folder, setFolder] = useState('');

  // To Store State If Something Changes In App
  let [yes, setyes] = useState(false);

  // To Store All Files And Folders Data
  const [data, setdata] = useState([]);

  // UseRef For Video
  const videoPlayer = useRef();

  // API Calling To Get All Files And Fodlers
  useEffect(() => {
    var formdata = new FormData();
    formdata.append('Email', Email);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch(ipAddress + 'getAll', requestOptions)
      .then(response => response.json())
      .then(e => setdata(e))
      .catch(error => console.log('error', error));
  }, [yes]);

  // Function For Calling API To Save Folder

  function onFolder() {
    // Managing State
    yes ? setyes(false) : setyes(true);
    var formdata = new FormData();
    formdata.append('Email', Email);
    formdata.append('FolderName', folder);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch(ipAddress + 'NewFolder', requestOptions)
      .then(response => response.json())
      .then(data => alert(data))
      .catch(error => console.log('error', error));
  }

  // Model For Viewing Images, Videos, PDF etc
  const [visible2, setVisible2] = useState(false);
  const showModal = () => setVisible2(true);
  const hideModal = () => setVisible2(false);

  // Style Of Modal
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  };

  // Store Name Of Reciever In Sharing File
  const [share, setShare] = useState('');

  // Store Name Of Sharing File
  const [showDropDown, setShowDropDown] = useState(false);
  const [sharingFile, setSharingFile] = useState('');
  const [permision, setpermision] = useState('');
  const [permisionList, setpermisionList] = useState([
    {label: 'Read-Only', value: 'ReadOnly'},
    {label: 'Read & Write', value: 'ReadWrite'},
  ]);

  // Function To Call API To Share File
  function onShare() {
    console.log(share, sharingFile);

    if (permision !== '') {
      // Date In This Format (YYYY-MM-DD)
      let date = new Date().toISOString().split('T')[0]; // If You Want To Also Share Time Then Remove .toISOString().split('T')[0]

      var formdata = new FormData();
      formdata.append('To', share);
      formdata.append('From', Email);
      formdata.append('Data', sharingFile);
      formdata.append('Date', date);
      formdata.append('Permission', permision);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(ipAddress + 'shareData', requestOptions)
        .then(response => response.json())
        .then(e => console.log(e))
        .catch(error => console.log('error', error));
    } else {
      alert('Please, Select Permission To Continue...');
    }
  }

  // Function To Call API To Delete File
  function onDelete() {
    // Managing State
    yes ? setyes(false) : setyes(true);
    var formdata = new FormData();
    formdata.append('Email', Email);
    formdata.append('FileName', sharingFile);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch(ipAddress + 'DeleteFile', requestOptions)
      .then(response => response.json())
      .then(e => alert(e))
      .catch(error => console.log('error', error))
      .finally(hideModal());
  }

  // To Save File Name Of Any File
  const [fileName, setfileName] = useState('');

  // To Save Type Of Any File
  const [type, setType] = useState('');

  // Check If File Exist In Favourites
  let isExistInFavourite = 'FALSE';

  // Function Check Extension Of File And Save File In UseState And Then Show Modal
  function onShowModel(item) {
    setfileName(item);
    setSharingFile(item);
    item.includes('.jpg') ? setType('Image') : null;
    item.includes('.png') ? setType('Image') : null;
    item.includes('jpeg') ? setType('Image') : null;
    item.includes('.mp4') ? setType('Video') : null;
    item.includes('.mpeg') ? setType('Video') : null;
    item.includes('.pdf') ? setType('PDF') : null;

    try {
      var formdata = new FormData();
      formdata.append('Email', Email);
      formdata.append('FileName', fileName);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(ipAddress + 'checkStarred', requestOptions)
        .then(response => response.json())
        .then(e => (isExistInFavourite = e))
        .catch(error => console.log('error', error))
        .finally(() => {
          if (isExistInFavourite == 'TRUE') {
            setselectedColor('red');
          } else {
            setselectedColor('grey');
          }
        });
    } finally {
      showModal();
    }
  }

  // Check If Given Item Is Directory Or File
  function isFile(item) {
    return item.includes('.') ? true : false;
  }

  //Favourite Chip Color
  const [selectedColor, setselectedColor] = useState('grey');

  function onFavourite() {
    if (isExistInFavourite == 'FALSE') {
      var formdata = new FormData();
      formdata.append('Email', Email);
      formdata.append('FileName', fileName);
      formdata.append('InFolder', 'No');
      formdata.append('ParentName', 'None');

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(ipAddress + 'addToStarred', requestOptions)
        .then(response => response.json())
        .then(e => {
          if (e == 'True') {
            setselectedColor('red');
          }
          if (e == 'False') {
            setselectedColor('grey');
          }
        })
        .catch(error => console.log('error', error));
    } else {
    }
  }

  function onDeleteFolder(item) {
    Alert.alert('Confirm!', `Do You Want To Delete This Folder? ${item}`, [
      {
        text: 'CANCEL',
        onPress: () => null,
        style: 'CANCEL',
      },
      {
        text: 'DELETE',
        onPress: () => {
          var formdata = new FormData();
          formdata.append('Email', Email);
          formdata.append('FolderName', item);

          var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
          };

          fetch(ipAddress + 'DeleteFolder', requestOptions)
            .then(response => response.json())
            .then(e => console.log(e))
            .catch(error => console.log('error', error))
            .finally(
              // Managing State
              yes ? setyes(false) : setyes(true),
            );
        },
        style: 'DELETE',
      },
    ]);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Text Field To Create A New Folder */}
      <View style={styles.container1}>
        <TextInput
          mode="outlined"
          label="Create New Folder"
          placeholder="New Folder"
          right={
            <TextInput.Icon
              name="arrow-collapse-right"
              onPress={() => {
                onFolder(), setFolder('');
              }}
            />
          }
          left={<TextInput.Icon name="folder" />}
          onChangeText={e => setFolder(e)}
          value={folder}
          style={styles.textFields}
        />
      </View>

      {/* Flat List To Show All Folders And Files */}
      <View style={styles.container2}>
        <List.Section title={Name}>
          <FlatList
            data={data}
            renderItem={({item}) => {
              return (
                <View>
                  {/* Check If Item Is Directory Or File */}
                  {!isFile(item) ? (
                    <List.Accordion
                      title={item}
                      onLongPress={() => onDeleteFolder(item)}
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
      </View>

      {/* FAB For More Options */}

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={() => (yes ? setyes(false) : setyes(true))}
      />

      {/* Modal To Display Files E.g. Image, Video, Pdf etc */}

      <Provider>
        <Portal>
          <Modal
            visible={visible2}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <View>
              <View>
                {/* Show Image */}
                {type == 'Image' ? (
                  <Image
                    source={{
                      uri: ipAddress + 'getFile/' + fileName + '/' + Email,
                    }}
                    style={styles.modalStyle}
                    resizeMode={'contain'}
                  />
                ) : null}
                {/* Show Video */}
                {type == 'Video' ? (
                  <Video
                    ref={ref => (videoPlayer.current = ref)}
                    source={{
                      uri: ipAddress + 'getFile/' + fileName + '/' + Email,
                    }}
                    controls={true}
                    muted={true}
                    resizeMode={'contain'}
                    style={styles.modalStyle}
                  />
                ) : null}
                {/* Show PDF */}
                {type == 'PDF' ? (
                  <Pdf
                    source={{
                      uri: ipAddress + 'getFile/' + fileName + '/' + Email,
                    }}
                    trustAllCerts={false}
                    style={styles.modalStyle}
                  />
                ) : null}
                <Divider />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                  }}>
                  <Chip
                    mode="outlined"
                    icon="star"
                    closeIcon={'settings'}
                    selected={true}
                    selectedColor={selectedColor}
                    style={{width: 100}}
                    onPress={() => onFavourite()}>
                    Favourite
                  </Chip>
                </View>

                <DropDown
                  label={'Permissions'}
                  visible={showDropDown}
                  showDropDown={() => setShowDropDown(true)}
                  onDismiss={() => setShowDropDown(false)}
                  value={permision}
                  setValue={setpermision}
                  list={permisionList}
                  activeColor={'#b0e0e6'}
                />

                <TextInput
                  mode="outlined"
                  label="Share To"
                  placeholder="Share"
                  right={
                    <TextInput.Icon name="share" onPress={() => onShare()} />
                  }
                  onChangeText={e => setShare(e)}
                  value={share}
                  style={[styles.textFields, {width: 350}]}
                />

                <Button
                  style={{marginTop: 10}}
                  mode="contained"
                  onPress={() => onDelete()}>
                  Delete
                </Button>
                <Button
                  style={{marginTop: 10}}
                  mode="contained"
                  onPress={hideModal}>
                  Go Back
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    marginTop: 10,
  },
  container2: {
    flex: 7,
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: 'gray',
    margin: 5,
  },
  modalStyle: {
    width: '100%',
    height: '60%',
  },
  textFields: {
    width: Dimensions.get('window').width * 0.8,
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#775fec',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
