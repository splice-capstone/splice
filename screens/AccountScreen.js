import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { findOrCreateUser, getMyReceipts } from '../src/tools/firebase';
import Constants from 'expo-constants';
import LoginScreen from './LoginScreen';
import LoggedInScreen from './LoggedInScreen';
import * as Google from 'expo-google-app-auth';
import { useStateValue } from '../state';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

export default function HomeScreen(props) {
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
            <Text>My Account</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
});
