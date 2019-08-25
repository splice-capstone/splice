import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { signIn } from '../src/utils/auth';
import { useStateValue } from '../state';

const LoginScreen = props => {
  const [{ currentUser, contacts }, dispatch] = useStateValue();

  const setUser = user => {
    dispatch({ type: 'SET_USER', user });
  };

  const setContacts = contacts => {
    dispatch({ type: 'SET_CONTACTS', contacts });
  };

  handleSignIn = async () => {
    try {
      const user = await signIn();
      await setUser(user);
      props.navigation.navigate('Home');
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splice.png')}
        style={styles.welcomeImage}
      />
      <Text style={styles.header}>splice</Text>
      <TouchableOpacity onPress={() => handleSignIn()}>
        <Image source={require('../assets/images/google_signin.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
});
