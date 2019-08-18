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
// import console = require('console');

export default function HomeScreen() {
  const [user, setUser] = useState({});

  const checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('ReceiptScreen');
      } else {
        this.props.navigation.navigate('LoginScreen');
      }
    });
  };

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
        setUser(result.user);
        findOrCreateUser(result.user);
        this.props.navigation.navigate('Receipt');
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
          {user.length ? (
            <LoggedInScreen user={user} />
          ) : (
            <LoginScreen signIn={signIn} />
          )}
        </View>
        <View style={styles.getStartedContainer}>
          <Text style={styles.welcome}>user's name: {user.name}</Text>
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
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
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
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
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
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
