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
    console.log('data', data);
    newReceipt.get().then(async function(querySnapshot) {
      if (querySnapshot.exists) {
        const newItems = await db
          .collection('receipts')
          .doc(querySnapshot.id)
          .collection('items');
        itemData.forEach(item => {
          newItems.add(item);
        });
        return newItems;
      } else {
        console.log('no such document!');
      }
    });
    return newReceipt.id;
  } catch (err) {
    return err;
  }
}

export async function getReceipt(receiptId) {
  try {
    //this is getting us receipt document
    let receiptInfo = await db
      .collection('receipts')
      .doc(receiptId)
      .get();

    //this = items from that receipt document
    let receiptItems = await db
      .collection('receipts')
      .doc(receiptId)
      .collection('items')
      .get();
    console.log('receptItems', receiptItems.data());

    let allReceiptItems = Promise.all(
      receiptItems.map(async item => {
        console.log('ITEMID', item.id);
        item = await db
          .collection('receipts')
          .doc(receiptId)
          .collection('items')
          .doc(item.id)
          .get();
        return {
          name: item.data().name,
          amount: item.data().amount,
          id: item.id,
          payees: item.data().payees,
        };
      })
    );
    let receiptSnapshot = {
      ...receiptInfo.data(),
      id: receiptId,
      items: allReceiptItems,
    };
    console.log('receiptSnap', receiptSnapshot);
    return receiptSnapshot;
  } catch (err) {
    return err;
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
    return `error: ${err}`;
  }
}

export async function getMyReceipts(email) {
  try {
    const user = await db
      .collection('users')
      .doc(email)
      .get();

    const myReceipts = await Promise.all(
      user.data().receipts.map(async receipt => {
        let receipt_users = await db
          .collection('receipts')
          .doc(receipt.id)
          .collection('receipt_users')
          .doc(email)
          .get();

        receipt_users = receipt_users.data();

        let receiptDetails = await receipt.get();
        let receiptSnapshot = {
          ...receiptDetails.data(),
          id: receiptDetails.id,
          receipt_users: {
            name: receipt_users.name,
            isOwner: receipt_users.isOwner,
            userSubtotal: receipt_users.userSubtotal,
            userTax: receipt_users.userTax,
            userTip: receipt_users.userTip,
            userTotal: receipt_users.userTotal,
          },
        };
        return receiptSnapshot;
      })
    );
    return myReceipts;
  } catch (err) {
    return `error: ${err}`;
  }
}

//reference -
// await db
//   .collection('receipts')
//   .where('users', 'array-contains', email)
//   .get()
//   .then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//       receipts.push(doc.data());
//     });
//   });
