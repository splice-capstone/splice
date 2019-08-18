import * as firebase from 'firebase';
import 'firebase/firestore';

import Constants from 'expo-constants';

firebase.initializeApp(Constants.manifest.extra.firebaseConfig);

const db = firebase.firestore();

export default db;

export async function userInit() {
  try {
    const { user } = await firebase.auth().signInAnonymously();
    await firebase.analytics().logEvent('foo', { bar: '123' });
    return 'worked';
  } catch (err) {
    return 'stuff';
  }
}

export async function findOrCreateUser(user) {
  try {
    const newUser = await db
      .collection('users')
      .doc(user.email)
      .set(
        { email: user.email, name: user.name, photoUrl: user.photoUrl },
        { merge: true }
      );
    return newUser;
  } catch (err) {
    return 'error';
  }
}
