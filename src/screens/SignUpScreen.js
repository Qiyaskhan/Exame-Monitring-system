import {SafeAreaView, StyleSheet, View, Text, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import ipAddress from '../components/api';

const LoginScreen = ({navigation}) => {
  /* Use States To Manage Username And Password And Secure Text */
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const onSignUp = async () => {
    if (email === '' || username === '' || password === '') {
      /* Alert On Empty Text Fields */
      alert('Please Enter your Credentials');
    } else {
      /* Setting Data For Post as Form Data*/
      const formdata = new FormData();
      formdata.append('email', email);
      formdata.append('name', username);
      formdata.append('password', password);

      /* Calling API */
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(ipAddress + 'signup', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result == 'True') {
            navigation.navigate('Routings', {
              Email: email,
              Name: username,
            });
          }
        })
        .catch(error => console.log('error', error));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor = "#006778"  barStyle="light-content" hidden = {false} translucent = {true} /> */}

      <View style={styles.subContainer1}>
        <Text style={{fontSize: 40, fontWeight: 'bold'}}>Dropbox Replica</Text>
      </View>

      <View style={styles.subContainer2}>
        {/* Email Text Input */}
        <TextInput
          mode="outlined"
          label="Email"
          placeholder="Enter Email"
          left={<TextInput.Icon name="mail" />}
          onChangeText={e => setEmail(e)}
          value={email}
          style={styles.textFields}
        />

        {/* User Name Text Input */}
        <TextInput
          mode="outlined"
          label="User Name"
          placeholder=" Enter Name"
          left={<TextInput.Icon name="face-man-profile" />}
          onChangeText={e => setUsername(e)}
          value={username}
          style={styles.textFields}
        />

        {/* Password Text Input */}
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Enter Password"
          left={<TextInput.Icon name="lock" />}
          secureTextEntry={secureText}
          onChangeText={e => setPassword(e)}
          value={password}
          style={styles.textFields}
        />
        {/* SignUp Button */}
        <Button
          mode="contained"
          onPress={() => onSignUp()}
          style={styles.loginButton}>
          SignUp
        </Button>
        {/* SignUp Button */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}>
          Login
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
