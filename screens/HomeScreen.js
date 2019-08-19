import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MonoText } from '../components/StyledText';
import db, { userInit, findOrCreateUser } from '../src/tools/firebase';
import Constants from 'expo-constants';
import LoginScreen from './LoginScreen';
import LoggedInScreen from './LoggedInScreen';
import Expo from 'expo';
import * as Google from 'expo-google-app-auth';

export default function HomeScreen(props) {
  const [user, setUser] = useState();

  const signIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: Constants.manifest.extra.androidClientId,
        iosClientId: Constants.manifest.extra.iosClientId,
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        let userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          }
        );
        await findOrCreateUser(result.user);
        await setUser({
          name: result.user.name,
          email: result.user.email,
          photoUrl: result.user.photoUrl,
        });
        return 'logged in';
      } else {
        return { cancelled: true };
      }
    } catch (err) {
      return { error: err };
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
          <View>
            {user ? (
              <LoggedInScreen user={user} />
            ) : (
              <View style={styles.loginContainer}>
                <LoginScreen signIn={signIn} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
    marginBottom: 20,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
});
