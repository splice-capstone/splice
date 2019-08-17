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

export async function findOrCreateUser() {
  try {
    const user = await db
      .collection('users')
      .doc(user_id)
      .set({ foo: 'bar' }, { merge: true });
  } catch (err) {
    return 'error';
  }
}
