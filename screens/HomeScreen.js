import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { findOrCreateUser, getMyReceipts } from '../src/tools/firebase';
import Constants from 'expo-constants';
import LoginScreen from './LoginScreen';
import LoggedInScreen from './LoggedInScreen';
import * as Google from 'expo-google-app-auth';
<<<<<<< HEAD
// import console = require('console');
// // import console = require('console');
=======
import { useStateValue } from '../state';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
>>>>>>> 9b2f9dc2f2054c5b174347911d1b160447f014c1

export default function HomeScreen(props) {
  const [{ currentUser, contacts }, dispatch] = useStateValue();

  const setUser = (user, receipts) => {
    dispatch({ type: 'SET_USER', user, receipts });
  };

  const setContacts = contacts => {
    dispatch({ type: 'SET_CONTACTS', contacts });
  };

  async function checkMultiPermissions() {
    const { status, expires } = await Permissions.askAsync(
      Permissions.CONTACTS
    );
    if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions');
    } else {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails],
      });
      if (data.length > 0) {
        const contacts = data.map(item => {
          if (item.emails && item.emails.length) {
            email = item.emails[0].email;
          }
          return {
            name: item.name,
            email,
          };
        });
        return contacts;
      }
    }
  }

  // if (!contacts) {
  //   const newContacts = checkMultiPermissions();
  //   setContacts(newContacts);
  // }

  const signIn = async () => {
    try {
      console.log('yoyoyoyoyo')
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
        const receipts = await getMyReceipts(result.user.email);
        await setUser(
          {
            name: result.user.name,
            email: result.user.email,
            photoUrl: result.user.photoUrl,
          },
          receipts
        );
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
            {!currentUser.name ? (
              <LoginScreen signIn={signIn} />
            ) : (
              <LoggedInScreen
                user={currentUser}
                navigation={props.navigation}
              />
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
});
