import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import {Appbar, TextInput, Button, Title} from 'react-native-paper';
import ipAddress from '../../components/api';

const AdminScreen = ({navigation}) => {
  let [tableHead, settableHead] = useState([
    'From',
    'To',
    'Shared Data',
    'Date',
  ]);
  let [tableData, settableData] = useState([]);

  let widthArr = [120, 120, 120, 120];
  let heightArr = [70, 70, 70, 70];

  useEffect(() => {
    var requestOptions = {
      method: 'Get',
      redirect: 'follow',
    };

    fetch(ipAddress + 'getSharedRecord', requestOptions)
      .then(response => response.json())
      .then(result => settableData(result))
      .catch(error => console.log('error', error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.subContainer1}>
        <Appbar.BackAction onPress={() => navigation.navigate('Login')} />
        <Appbar.Content title="Shared Record" />
      </Appbar.Header>
      <View style={styles.container2}>
        <ScrollView>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderWidth: 2}}>
                <Row
                  data={tableHead}
                  widthArr={widthArr}
                  heightArr={heightArr}
                  style={styles.head}
                  textStyle={[styles.text, {fontWeight: 'bold'}]}
                />
                <Rows
                  data={tableData}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00ced1',
  },
  subContainer1: {
    backgroundColor: '#b0e0e6',
  },
  container2: {flex: 1, padding: 16, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#b0e0e6'},
  text: {
    margin: 6,
    textAlign: 'center',
    backgroundColor: '#00ced1',
  },
  textFields: {
    backgroundColor: '#b0e0e6',
    width: Dimensions.get('window').width * 0.9,
  },
  searchContainer: {
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminScreen;
