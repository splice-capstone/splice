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
    newReceipt.get().then(async function(docum) {
      if (docum.exists) {
        const newItems = await db
          .collection('receipts')
          .doc(docum.id)
          .collection('items');
        itemData.forEach(item => {
          newItems.add(item);
        });
        return newItems;
      } else {
        console.log('no such document!');
      }
    });
    return newReceipt;
  } catch (err) {
    return err;
  }
}
