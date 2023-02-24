import {StyleSheet} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ipAddress from '../../../components/api';

let file = null;

async function ShareFiles(Email) {
  try {
    try {
      file = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        // allowMultiSelection: true,
      });
      console.log('File : ' + JSON.stringify(file));
    } catch (err) {
      file = null;
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  } finally {
    if (file != null) {
      let fileName = file[0].name;
      let fileType = file[0].type;
      let uri = file[0].uri;
      console.log(fileName);
      console.log(fileType);
      console.log(uri);
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

      fetch(ipAddress + 'NewFile', requestOptions)
        .then(response => response.json())
        .then(e => console.log(e))
        .catch(error => console.log('error', error));
    } else {
      alert('Please Select File first');
    }
  }
}

export default ShareFiles;

const styles = StyleSheet.create({});
