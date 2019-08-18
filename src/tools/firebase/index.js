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

export async function createReceipt(data, itemData) {
  try {
    const newReceipt = await db.collection('receipts').add(data);
    const newItems = await db
      .collection('receipts')
      .doc(newReceipt)
      .collection('items')
      .add(itemData);
    return { newReceipt, newItems };
  } catch (err) {
    return err;
  }
}
