import {StyleSheet} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import ipAddress from '../../../components/api';

let video = null;
async function RecordVideos(Email) {
  try {
    let options = {
      quality: 0.5,
      mediaType: 'video',
    };
    video = await launchCamera(options);
  } finally {
    if (video != null) {
      let fileName = video.assets[0].fileName;
      let fileType = video.assets[0].type;
      let uri = video.assets[0].uri;
      console.log(fileName);
      console.log(fileType);
      console.log(uri);
      console.log(Email);
      const formdata = new FormData();
      formdata.append('Email', Email);
      formdata.append('file', {
        name: fileName,
        type: fileType,
        uri,
      });

      var requestOptions = {
        method: 'POST',
        body: formdata,
      };

      fetch(ipAddress + 'setFile', requestOptions)
        .then(response => response.json())
        .then(e => console.log(e))
        .catch(error => console.log('error', error));
    } else {
      alert('Something Went Wrong...');
    }
  }
}

export default RecordVideos;

const styles = StyleSheet.create({});
