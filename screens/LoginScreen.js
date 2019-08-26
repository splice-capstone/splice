import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/splice.png')}
            style={styles.welcomeImage}
          />
          <Text style={styles.header}>splice</Text>
          <TouchableOpacity onPress={() => handleSignIn()}>
            <Image source={require('../assets/images/google_signin.png')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  contentContainer: {
    paddingTop: 30,
  },
  header: {
    marginTop: 10,
    fontSize: 18,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
});
