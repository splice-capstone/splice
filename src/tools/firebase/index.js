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
    return `error: ${err}`;
  }
}

export async function findUser(email) {
  try {
    email.toLowerCase();
    let user = await db
      .collection('users')
      .orderBy('email')
      .where('email', '==', email)
      .get();
    user = await user.data();
    const userDetails = {
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };
    console.log('user', userDetails);
    return userDetails;
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function createReceipt(data, itemData) {
  try {
    const newReceipt = await db.collection('receipts').add(data);
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

export async function addUserToReceipt(receipt, user) {
  try {
    //   add receipt_users subcollection doc (default to false on host field)
    //   add other users to the friends item on Users doc
    //   add receipt to Users doc
    //   add users to every item doc to payees map (default to false)- email as key

    // const receipt = await db.collection('receipts').doc(receipt.id);

    // receipt.get().then(async function(querySnapshot) {
    //   if (querySnapshot.exists) {
    //     const newItems = await db
    //       .collection('receipts')
    //       .doc(querySnapshot.id)
    //       .collection('items');
    //     itemData.forEach(item => {
    //       newItems.add(item);
    //     });
    //     return newItems;
    //   } else {
    //     console.log('no such document!');
    //   }
    // });
    return receipt.id;
  } catch (err) {
    return `error: ${err}`;
  }
}
