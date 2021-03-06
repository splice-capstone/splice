import * as firebase from 'firebase';
import 'firebase/firestore';
import Constants from 'expo-constants';

firebase.initializeApp(Constants.manifest.extra.firebaseConfig);

const db = firebase.firestore();

export default db;

export async function createReceipt(data, itemData, currentUser) {
  try {
    const newReceipt = await db.collection('receipts').add(data);
    //get receipt doc, adding items
    await newReceipt.get().then(async function(querySnapshot) {
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
            paid: true,
            photoUrl: currentUser.photoUrl,
            items: [],
          });

        //add new recp to users -> user -> receipts
        userDoc.update({
          receipts: firebase.firestore.FieldValue.arrayUnion(newReceipt),
        });

        //add user to receipt payees array - false signifies whether the user has paid their share, owner defaults to true
        let payees = {};
        payees[currentUser.email] = false;
        newReceipt.update(payees);
        // return newItems;
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
    if (!user.token) {
      user.token = null;
    }
    const newUser = await db
      .collection('users')
      .doc(user.email)
      .set(
        {
          email: user.email,
          name: user.name,
          photoUrl: user.photoUrl,
          token: user.token,
        },
        { merge: true }
      );
    return newUser[0];
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function findUserByToken(token) {
  try {
    const results = [];

    const user = await db
      .collection('users')
      .where('token', '==', token)
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
    return results;
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function findUser(email) {
  try {
    const results = [];
    const search = email.toLowerCase().trim();

    const user = await db
      .collection('users')
      .where('email', '==', search)
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

    return results;
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function getMyReceipts(email) {
  try {
    let user = db.collection('users').doc(email);
    user = await user.get();
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

export async function addUserToReceipt(receipt, userEmail) {
  try {
    // const receiptDoc = await receiptRef.get();

    //get user doc & add receipt to user doc receipts reference array
    const userDoc = await db.collection('users').doc(userEmail);

    const userData = await db
      .collection('users')
      .doc(userEmail)
      .get();

    //add receipt_users doc for user on current receipt
    await db
      .collection('receipts')
      .doc(receipt.id)
      .collection('receipt_users')
      .add({
        isOwner: false,
        name: userData.data().name,
        email: userEmail,
        paid: false,
        photoUrl: userData.data().photoUrl,
        items: [],
      });

    //add user to receipt payees array - false signifies whether the user has paid their share
    const newPayees = receipt.payees;

    newPayees[userEmail] = false;

    await db
      .collection('receipts')
      .doc(receipt.id)
      .set({ payees: newPayees }, { merge: true });

    userDoc.update({
      receipts: firebase.firestore.FieldValue.arrayUnion(
        db.collection('receipts').doc(receipt.id)
      ),
    });

    const itemMapArr = [];

    //get query snapshot of itemCollection
    const itemColl = await db
      .collection('receipts')
      .doc(receipt.id)
      .collection('items')
      .get();

    //add item document id and payee info into itemMapArr
    const itemCollection = itemColl.forEach(querySnap => {
      const { payees } = querySnap.data();
      itemMapArr.push({
        id: querySnap.id,
        payees,
      });
    });

    //map over itemCollection doc replacing each element
    //with an array of promises returned from .set on each doc
    await Promise.all(
      itemMapArr.map(async itemDataObj => {
        itemDataObj.payees[userEmail] = {
          email: userEmail,
          isPayee: false,
          photo: userData.data().photoUrl,
        };
        return db
          .collection('receipts')
          .doc(receipt.id)
          .collection('items')
          .doc(itemDataObj.id)
          .set({ payees: itemDataObj.payees }, { merge: true });
      })
    );
    if (userData.data().expoToken) return userData.data().expoToken;
    else return null;
  } catch (err) {
    console.error(err);
    return `error: ${err}`;
  }
}

export async function toggleReceiptUser(
  user,
  itemId,
  receiptId,
  payees,
  amount
) {
  const newPayees = payees;
  const email = user.email;
  const photo = user.photoUrl;

  if (newPayees[user.email].isPayee) {
    newPayees[user.email] = {
      email,
      isPayee: false,
      photo,
    };
  } else {
    newPayees[user.email] = {
      email,
      isPayee: true,
      photo,
    };
  }

  let trueArr = [];

  for (let [key, value] of Object.entries(payees)) {
    if (value.isPayee) {
      trueArr.push(true);
    }
  }

  const costPerUser = trueArr.length > 0 ? amount / trueArr.length : amount;

  const itemDocRef = db
    .collection('receipts')
    .doc(receiptId)
    .collection('items')
    .doc(itemId);

  try {
    const newItemDoc = await itemDocRef.set(
      {
        payees: payees,
        costPerUser,
      },
      { merge: true }
    );
  } catch (err) {
    console.error('big old error in togglereceiptuser', err);
    return `error: ${err}`;
  }

  return 'hey';
}

export async function calculateSubtotal(receiptId, receiptUserId) {
  try {
    const receiptUserDoc = await db
      .collection('receipts')
      .doc(receiptId)
      .collection('receipt_users')
      .doc(receiptUserId)
      .get();
    const itemPriceArray = await Promise.all(
      receiptUserDoc.data().items.map(async item => {
        const itemDoc = await item.get();
        return itemDoc.data().costPerUser;
      })
    );
    const subtotal = itemPriceArray.reduce(function(subtotal, currentValue) {
      return subtotal + currentValue;
    }, 0);
    return subtotal;
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function completeReceipt(
  receiptId,
  checkoutData,
  receiptUserId,
  email
) {
  try {
    //TODO: save friends
    await db
      .collection('receipts')
      .doc(receiptId)
      .collection('receipt_users')
      .doc(receiptUserId)
      .set(checkoutData, { merge: true });

    const payees = {};
    payees[email] = true;

    await db
      .collection('receipts')
      .doc(receiptId)
      .set({ payees }, { merge: true });

    return 'success';
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function closeReceipt(receiptId) {
  try {
    await db
      .collection('receipts')
      .doc(receiptId)
      .set({ open: false }, { merge: true });
    return 'success';
  } catch (err) {
    return `error: ${err}`;
  }
}

export async function editReceipt(receiptId, tip, total, subtotal) {
  try {
    const receiptEditRef = await db.collection('receipts').doc(receiptId);
    const updatedReceipt = receiptEditRef.update({
      subtotal: subtotal,
      tip: tip,
      total: total,
    });
    return receiptEditRef.data();
  } catch (err) {
    return err;
  }
}

export async function addReceiptItems(receiptId, newItem) {
  try {
    const receiptItemEditRef = await db
      .collection('receipts')
      .doc(receiptId)
      .collection('items')
      .add(newItem);
    return receiptItemEditRef;
  } catch (err) {
    return err;
  }
}

// delete item

export async function removeReceiptItem(receiptId, itemId) {
  try {
    const receiptItemEditRef = await db
      .collection('receipts')
      .doc(receiptId)
      .collection('items')
      .doc(itemId)
      .delete();
  } catch (err) {
    return err;
  }
}

export async function getMyFriends(email) {
  try {
    let myFriends = [];
    let user = db.collection('users').doc(email);
    user = await user.get();
    const myFriendsRefs = await Promise.all(
      user.data().friends.map(async friend => {
        let friendDetails = await db
          .collection('users')
          .doc(friend.id)
          .get();

        const { name, photoUrl } = friendDetails.data();
        myFriends.push({
          name,
          photoUrl,
          id: friendDetails.id,
          email: friendDetails.id,
        });
      })
    );
    return myFriends;
  } catch (err) {
    return `error: ${err}`;
  }
}
