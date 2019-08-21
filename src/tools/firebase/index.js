import * as firebase from 'firebase';
import 'firebase/firestore';
import Constants from 'expo-constants';

firebase.initializeApp(Constants.manifest.extra.firebaseConfig);

const db = firebase.firestore();

export default db;

//wrap all parts in try/catches and handle each catch if could still recover

export async function createReceipt(data, itemData, currentUser) {
  try {
    const newReceipt = await db.collection('receipts').add(data);
    //get receipt doc, adding items
    newReceipt.get().then(async function(querySnapshot) {
      if (querySnapshot.exists) {
        const newItems = await db
          .collection('receipts')
          .doc(querySnapshot.id)
          .collection('items');
        itemData.forEach(item => {
          newItems.add(item);
        });
        //add receipt owner


          //get user doc
        const userDoc = await db.collection('users').doc(currentUser.email)
        await db
          .collection('receipts')
          .doc(querySnapshot.id)
          .collection('receipt_users')
          .add({
            isOwner: true,
            name: currentUser.name,
            userDoc: userDoc,
            userSubtotal: data.subtotal,
            userTax: data.tax,
            userTip: 0,
            userTotal: data.total,
          });
        //add new recp to users -> user -> receipts

        userDoc.update({
          receipts: firebase.firestore.FieldValue.arrayUnion(newReceipt),
        });
        return newItems;
      } else {
        console.log('no such document!');
      }
    });

    return newReceipt.id;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export async function getReceipt(receiptId) {
  const contextItems = [];
  try {
    //this is getting us receipt document
    let receiptInfo = await db
      .collection('receipts')
      .doc(receiptId)
      .get();

    //this = items from that receipt document
    let receiptItems = await db
      .collection('receipts')
      .doc(receiptInfo.id)
      .collection('items')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          // console.log("****items*****", doc.id, doc.data());
          contextItems.push({
            name: doc.data().name,
            amount: doc.data().amount,
            id: doc.id,
            payees: doc.data().payees,
          });
        });
      });

    let receiptUsers = await db
      .collection('receipts')
      .doc(receiptInfo.id)
      .collection('receipt_users')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          // console.log("****items*****", doc.id, doc.data());
          contextItems.push({
            name: doc.data().name,
            amount: doc.data().amount,
            id: doc.id,
            payees: doc.data().payees,
          });
        });
      });

    // console.log("receptItems", receiptItems);

    return {
      ...receiptInfo.data(),
      id: receiptId,
      items: contextItems,
    };
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

export async function getMyReceipts(email) {
  try {
    const user = await db
      .collection('users')
      .doc(email)
      .get();

    const myReceipts = await Promise.all(
      user.data().receipts.map(async receipt => {
        //get user's receipt_users doc from all the receipts they're on
        let receipt_users = await db
          .collection('receipts')
          .doc(receipt.id)
          .collection('receipt_users')
          .doc(email)
          .get();

          console.log('recp users doc*******', receipt_users.data())

        if (receipt_users.data()) {
          const receiptData = receipt_users.data();
          //create object for user details you want accessible on my receipt
          const myDetails = {
            name: receiptData.name,
            isOwner: receiptData.isOwner,
            userSubtotal: receiptData.userSubtotal,
            userTax: receiptData.userTax,
            userTip: receiptData.userTip,
            userTotal: receiptData.userTotal,
          };

          //get receipt doc
          let receiptDetails = await receipt.get();

          //create object for receipt id, receipt details and users details
          let receiptSnapshot = {
            ...receiptDetails.data(),
            id: receiptDetails.id,
            myDetails,
          };
          return receiptSnapshot;
        }
      })
    );
    console.log('my receipts here', myReceipts);
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
