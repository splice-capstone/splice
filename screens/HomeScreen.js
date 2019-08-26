import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import { useStateValue } from '../state';
import { Container, Header, Content, Button, Text, Title } from 'native-base';
import { signOut } from '../src/utils/auth';

export default function HomeScreen(props) {
  const [{ currentUser }, dispatch] = useStateValue();

  const setUser = user => {
    dispatch({ type: 'SET_USER', user });
  };

  handleSignOut = () => {
    //clear token from Async storage
    signOut();
    //clear user from state which will navigate to login
    setUser({});
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Image
          source={require('../assets/images/splice.png')}
          style={styles.welcomeImage}
        />
        <Text style={styles.header}>splice</Text>
      </View>
      <View style={styles.bottom}>
        <Button
          title="TAKE A SNAPSHOT"
          success
          style={styles.button}
          onPress={() => props.navigation.navigate('Add Receipt')}
        >
          <Text light>TAKE A SNAPSHOT</Text>
        </Button>
        <Button
          light
          style={styles.button}
          onPress={() => props.navigation.navigate('Receipt Form')}
        >
          <Text black center>
            BY HAND
          </Text>
        </Button>
        <Button bordered style={styles.button} onPress={() => handleSignOut()}>
          <Text black center>
            SIGN OUT
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  header: {
    marginTop: 10,
    fontSize: 18,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  button: {
    margin: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
  },
});
