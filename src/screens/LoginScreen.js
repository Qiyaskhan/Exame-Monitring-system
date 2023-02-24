import {SafeAreaView, StyleSheet, View, Text, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import ipAddress from '../components/api';

const LoginScreen = ({navigation}) => {
  /* Use States To Manage Username And Password And Secure Text */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const onLogin = async () => {
    if (username === '' || password === '') {
      /* Alert On Empty Text Fields */
      alert('Please Enter your Credentials');
    } else {
      /* Setting Data For Post as Form Data*/
      const data = new FormData();
      data.append('email', username);
      data.append('password', password);

      /* Calling API */
      try {
        const response = await fetch(ipAddress + 'login', {
          method: 'POST',
          body: data,
        });

        /* Getting Response and Data From Server */
        const json = await response.json();
        console.log(json[0].Role);

        if (json[0].Role == 'User') {
          if (username === json[0].Email && password === json[0].Password) {
            setUsername('');
            setPassword('');
            navigation.navigate('Routings', {
              Email: json[0].Email,
              Name: json[0].Name,
            });
          } else {
            alert('Incorrect Credentials');
          }
        } else if (json[0].Role == 'Admin') {
          if (username == json[0].Email && password == json[0].Password) {
            setUsername('');
            setPassword('');

            navigation.navigate('Admin', {
              Email: json[0].Email,
              Name: json[0].Name,
            });
          } else {
            alert('Incorrect Credentials');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor = "#006778"  barStyle="light-content" hidden = {false} translucent = {true} /> */}

      <View style={styles.subContainer1}>
        <Text style={{fontSize: 40, fontWeight: 'bold'}}>Dropbox Replica</Text>
      </View>

      <View style={styles.subContainer2}>
        {/* User Name Text Input */}
        <TextInput
          mode="outlined"
          label="User Name"
          placeholder="User Name"
          left={<TextInput.Icon name="face-man-profile" />}
          onChangeText={e => setUsername(e)}
          value={username}
          style={styles.textFields}
        />

        {/* Password Text Input */}
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Password"
          right={
            <TextInput.Icon
              name="eye"
              onPress={() =>
                secureText ? setSecureText(false) : setSecureText(true)
              }
            />
          }
          left={<TextInput.Icon name="lock" />}
          secureTextEntry={secureText}
          onChangeText={e => setPassword(e)}
          value={password}
          style={styles.textFields}
        />
        {/* Login Button */}
        <Button
          mode="contained"
          onPress={() => onLogin()}
          style={styles.loginButton}>
          Login
        </Button>
        {/* SignUp Button */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.loginButton}>
          SignUp
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#775fec',
  },
  subContainer1: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#775fec',
  },

  subContainer2: {
    flex: 3,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#775fec',
  },
  image: {
    flex: 1,
    aspectRatio: 3 / 1,
    alignSelf: 'center',
  },
  textFields: {
    width: Dimensions.get('window').width * 0.9,
    alignSelf: 'center',
    backgroundColor: '#775fec',
  },
  loginButton: {
    width: Dimensions.get('window').width * 0.5,
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default LoginScreen;
