import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Container, Header, Content, Button, Text, Title } from 'native-base';
import { loginWithGoogle, loginWithFacebook } from '../src/utils/auth';
import { useStateValue } from '../state';

const LoginScreen = props => {
  const [{ currentUser, contacts }, dispatch] = useStateValue();

  const setUser = user => {
    dispatch({ type: 'SET_USER', user });
  };

  const setContacts = contacts => {
    dispatch({ type: 'SET_CONTACTS', contacts });
  };

  handleSignIn = async (type, props) => {
    try {
      if (type === 'facebook') {
        const user = await loginWithFacebook();
        await setUser(user);
      }
      if (type === 'google') {
        const user = await loginWithGoogle();
        await setUser(user);
      }
      props.navigation.navigate('Home');
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Image
          source={require('../assets/images/splice.png')}
          style={styles.welcomeImage}
        />
        <Text style={styles.header}>splice</Text>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => handleSignIn('google')}
        >
          <Image
            style={styles.googleImage}
            source={require('../assets/images/google-signin-button.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSignIn('facebook')}>
          <Image
            style={styles.facebookImage}
            source={require('../assets/images/facebook.png')}
          />
        </TouchableOpacity>
        <Button small bordered style={{ marginTop: 10 }}>
          <Text>Login with email</Text>
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  header: {
    marginTop: 10,
    fontSize: 18,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
  },
  buttons: {
    marginTop: 100,
  },
  googleImage: {
    height: 50,
    resizeMode: 'contain',
    margin: 10,
  },
  facebookImage: {
    height: 35,
    resizeMode: 'contain',
    margin: 10,
  },
});
