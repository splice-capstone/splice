import { AsyncStorage } from 'react-native';
import { findOrCreateUser, findUserByToken } from '../tools/firebase';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import { useStateValue } from '../../state';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

export const signOut = () => AsyncStorage.removeItem('USER_KEY');

export const isSignedIn = async () => {
  try {
    let token = await AsyncStorage.getItem('USER_KEY');
    if (token) {
      console.log('finding user', token);
      const user = await findUserByToken(token);
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

export const checkMultiPermissions = async () => {
  const { status, expires } = await Permissions.askAsync(Permissions.CONTACTS);
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
};

// if (!contacts) {
//   const newContacts = checkMultiPermissions();
//   setContacts(newContacts);
// }

export const signIn = async () => {
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
      const user = {
        name: result.user.name,
        email: result.user.email,
        photoUrl: result.user.photoUrl,
        token: result.accessToken,
      };
      await findOrCreateUser(user);
      await AsyncStorage.setItem('USER_KEY', result.accessToken);
      return user;
    } else {
      return { cancelled: true };
    }
  } catch (err) {
    return { error: err };
  }
};
