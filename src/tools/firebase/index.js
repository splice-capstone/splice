import * as firebase from 'firebase';
import 'firebase/firestore';
import Constants from 'expo-constants';

firebase.initializeApp(Constants.manifest.extra.firebaseConfig);

const db = firebase.firestore();

export default db;

//TODO: wrap all parts in try/catches and handle each catch if could still recover

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

        //multi-step add receipt owner -

        //get user doc
        const userDoc = await db.collection('users').doc(currentUser.email);

        //add receipt_user doc for owner
        await db
          .collection('receipts')
          .doc(querySnapshot.id)
          .collection('receipt_users')
          .add({
            isOwner: true,
            name: currentUser.name,
            email: currentUser.email,
            userSubtotal: data.subtotal,
            userTax: data.tax,
            userTip: 0,
            userTotal: data.total,
            paid: true,
            photoUrl: currentUser.photoUrl,
          });

        //add new recp to users -> user -> receipts
        userDoc.update({
          receipts: firebase.firestore.FieldValue.arrayUnion(newReceipt),
        });

        //add user to receipt payees array - false signifies whether the user has paid their share, owner defaults to true
        let payees = {};
        payees[currentUser.email] = false;
        newReceipt.update(payees);
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
  const contextUsers = [];

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
          contextUsers.push({
            name: doc.data().name,
            isOwner: doc.data().isOwner,
            userSubtotal: doc.data().userSubtotal,
            userTax: doc.data().userTax,
            userTip: doc.data().userTip,
            userTotal: doc.data().userTotal,
            paid: doc.data().paid,
            photoUrl: doc.data().photoUrl,
          });
        });
      });

    return {
      ...receiptInfo.data(),
      id: receiptId,
      items: contextItems,
      users: contextUsers,
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
    const results = [];

    const user = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          let userDetails = {
            email: doc.data().email,
            name: doc.data().name,
            photoUrl: doc.data().photoUrl,
          };
          results.push(userDetails);
        });
      });

    console.log('user', results);
    return results;
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
          .where('email', '==', email)
          .get();

        let myDetails = {};
        receipt_users.forEach(receiptData => {
          receiptData = receiptData.data();
          myDetails = {
            name: receiptData.name,
            isOwner: receiptData.isOwner,
            userSubtotal: receiptData.userSubtotal,
            userTax: receiptData.userTax,
            userTip: receiptData.userTip,
            userTotal: receiptData.userTotal,
            paid: receiptData.paid,
            photoUrl: receiptData.photoUrl,
          };
        });

        // const receiptData = receipt_users.data();
        //create object for user details you want accessible on my receipt

        //get receipt doc
        let receiptDetails = await receipt.get();

        //create object for receipt id, receipt details and users details
        let receiptSnapshot = {
          ...receiptDetails.data(),
          id: receiptDetails.id,
          myDetails,
        };

        return receiptSnapshot;
      })
    );
    return myReceipts;
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function addUserToReceipt(receipt, email) {
  try {
    //get user doc
    const userDoc = await db.collection('users').doc(email);

    //get receipt doc
    const receiptDoc = await db.collection('receipts').doc(receipt.id);

    //add receipt to user doc receipts reference array
    userDoc.update({
      receipts: firebase.firestore.FieldValue.arrayUnion(receiptDoc),
    });

    //add receipt_users doc for user on current receipt
    await db
      .collection('receipts')
      .doc(receipt.id)
      .collection('receipt_users')
      .add({
        isOwner: false,
        name: userDoc.data().name,
        email: userDoc.data().email,
        userSubtotal: 0,
        userTax: 0,
        userTip: 0,
        userTotal: 0,
        paid: false,
        photoUrl: userDoc.data().photoUrl,
      });

    //add user to receipt payees array - false signifies whether the user has paid their share
    const receiptData = await receiptDoc.get();
    const payees = receiptData.data().payees;
    payees[userDoc.data().email] = false;

    receiptDoc.set({ payees }, { merge: true });

    //add users to every item doc to payees map (default to false)- email as key
    await receiptDoc
      .collection('items')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          doc.set(
            {
              payees,
            },
            { merge: true }
          );
        });
      });

    return receipt.id;
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function updateItem(receiptId, item, user, receiptUserId) {
  try {
    //find current user on payees map & update to opposite - toggle function
    const payees = item.payees;
    payees[user.email] = !payees[user.email];

    //this updates the payees map on the items doc
    await db
      .collection('receipts')
      .doc(receiptId)
      .collection('items')
      .doc(item.id)
      .set(
        {
          payees,
        },
        { merge: true }
      );
    //recalculate item price per user - count how many payees are true and divide amount by that number, save this val on item.
    const itemRef = db
      .collection('receipts')
      .doc(receiptId)
      .collection('items')
      .doc(item.id);

    const itemData = await itemRef.get();
    const itemPayees = itemData.data().payees;
    const trues = Object.values(itemPayees).filter(val => val === true);
    const costPerUser = itemData.data().amount / trues.length;

    await itemRef.set({ costPerUser }, { merge: true });

    //add item ref to receipt_users doc
    if (payees[user.email]) {
      await db
        .collection('receipts')
        .doc(receiptId)
        .collection('receipt_users')
        .doc(receiptUserId)
        .update({
          items: firebase.firestore.FieldValue.arrayUnion(itemRef),
        });
    } else {
      await db
        .collection('receipts')
        .doc(receiptId)
        .collection('receipt_users')
        .doc(receiptUserId)
        .update({
          items: firebase.firestore.FieldValue.arrayRemove(itemRef),
        });
    }

    //ON LOAD
    //map over user emails array - update the item in the user items map to user amount
    //recalculate all users subtotals based on sum of user items map
    //calculate users tax based on user subtotal/overall total * overall tax
    //calculate users tip based on user subtotal/overall total * overall tip
    //calculate users total based on user subtotal + user tax + user tip
    return costPerUser;
  } catch (err) {
    console.log('err', err);
    return `error: ${err}`;
  }
}

export async function completeReceipt(receipt, user) {
  try {
    //   add other users to the friends item on Users doc
    return receipt.id;
  } catch (err) {
    return `error: ${err}`;
  }
}
