import { AsyncStorage } from 'react-native';
import { findOrCreateUser, findUserByToken } from '../tools/firebase';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import { useStateValue } from '../../state';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';

export const signOut = () => AsyncStorage.removeItem('USER_KEY');

export const isSignedIn = async () => {
  try {
    let token = await AsyncStorage.getItem('USER_KEY');
    if (token) {
      const user = await findUserByToken(token);
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

//TODO: use contacts for better bill splitting with friends

// export const checkMultiPermissions = async () => {
//   const { status, expires } = await Permissions.askAsync(Permissions.CONTACTS);
//   if (status !== 'granted') {
//     alert('Hey! You have not enabled selected permissions');
//   } else {
//     const { data } = await Contacts.getContactsAsync({
//       fields: [Contacts.Fields.Emails],
//     });
//     if (data.length > 0) {
//       const contacts = data.map(item => {
//         if (item.emails && item.emails.length) {
//           email = item.emails[0].email;
//         }
//         return {
//           name: item.name,
//           email,
//         };
//       });
//       return contacts;
//     }
//   }
// };

// if (!contacts) {
//   const newContacts = checkMultiPermissions();
//   setContacts(newContacts);
// }

export const loginWithGoogle = async () => {
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

      const { idToken, accessToken } = result;
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          console.log('error', error);
        });
      return user;
    } else {
      return { cancelled: true };
    }
  } catch (err) {
    return { error: err };
  }
};

export async function loginWithFacebook() {
  try {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync(
      Constants.manifest.extra.facebookApiKey,
      {
        permissions: ['public_profile', 'email'],
      }
    );
    if (type === 'success') {
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=email,id,name,picture.type(large)`
      );

      const data = await response.json();
      const user = {
        name: data.name,
        email: data.email,
        photoUrl: data.picture.data.url,
        token,
      };
      await findOrCreateUser(user);
      await AsyncStorage.setItem('USER_KEY', token);

      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          console.log('error', error);
        });
      return user;
    } else {
      return { cancelled: true };
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}
