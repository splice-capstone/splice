/* eslint-disable quotes */
/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStateValue } from '../state';
import ItemCard from './ItemCard';
import { Container, Content, Button, Icon, Text, View } from 'native-base';
import {
  useDocumentData,
  useCollectionData,
  useCollection,
} from 'react-firebase-hooks/firestore';
import db, {
  calculateSubtotal,
  toggleReceiptUser,
  completeReceipt,
} from '../src/tools/firebase';
import LoadScreen from './LoadScreen';
export default function CurrentReceipt(props) {
  const [{ currentUser }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');
  const [userSubtotal, setSubtotal] = useState(0);
  const [userTax, setTax] = useState(0);
  const [userTip, setTip] = useState(0);
  const [userTotal, setTotal] = useState(0);
  const [receiptItems, setItems] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [myPrices, setMyPrices] = useState({});
  const receiptId = props.navigation.getParam(
    'receiptId',
    '1Y8k9OAQhJAlctRTAjYW'
  );
  let [receiptValue, receiptLoading, receiptError] = useDocumentData(
    db.collection('receipts').doc(receiptId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: 'id',
    }
  );

  let [userValues, userLoading, userError] = useCollectionData(
    db
      .collection('receipts')
      .doc(receiptId)
      .collection('receipt_users')
      .where('email', '==', currentUser.email),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: 'id',
    }
  );
  const tapItem = async (userId, itemId, payees, amount) => {
    try {
      if (userValues[0].paid && !userValues[0].isOwner) {
        Alert.alert("You've already checked out!");
      } else {
        if (!receiptValue.open) {
          Alert.alert('Receipt is closed!');
        } else {
          await toggleReceiptUser(userId, itemId, receiptId, payees, amount);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const calcSubtotal = () => {
    let subtotal = 0;
    receiptItems.forEach(item => {
      if (item.payees[currentUser.email].isPayee) {
        subtotal += item.costPerUser;
      }
    });
    return subtotal;
  };
  const handleCheckout = () => {
    //save user amounts on receipt_user doc & update to say user has paid
    const checkoutData = {
      subtotal: calcSubtotal() / 100,
      tax: userTax,
      tip: userTip,
      total: userTotal,
      paid: true,
    };
    const receiptUserId = userValues[0].id;
    completeReceipt(receiptId, checkoutData, receiptUserId, currentUser.email);
  };

  useEffect(() => {
    const unsub = db
      .collection('receipts')
      .doc(receiptId)
      .collection('items')
      .onSnapshot(snap => {
        const itemArr = [];
        snap.forEach(itemDoc => {
          const { name, amount, payees, costPerUser } = itemDoc.data();
          itemArr.push({
            name,
            key: itemDoc.id,
            amount,
            payees,
            costPerUser,
          });
        });
        setLoadingState(false);
        setItems(itemArr);
      });
    const newComments = props.navigation.getParam('comments', '');
    if (newComments) {
      setComments(newComments);
    }
    if (userValues && receiptValue && userValues[0].id) {
      //recalculate my user subtotals based on sum of my items map

      //calculate user tax based on user subtotal/overall total * overall tax
      setTax(((userSubtotal / receiptValue.total) * receiptValue.tax) / 100);
      //calculate user tip based on user subtotal/overall total * overall tip
      setTip(((userSubtotal / receiptValue.total) * receiptValue.tip) / 100);
      //calculate user total based on user subtotal + user tax + user tip
      setTotal(userSubtotal + userTax + userTip);
    }
    return () => unsub();
  }, [receiptId]);
  return (
    <Container>
      {(receiptError || userError) && (
        <Text>Error: {JSON.stringify(receiptError)}</Text>
      )}
      {(receiptLoading || userLoading) && null}
      {receiptValue && userValues && (
        <Content>
          {receiptValue.owner == userValues[0].email ? (
            <View style={styles.topView}>
              <Icon
                type="AntDesign"
                name="form"
                style={{ color: '#3d403d', paddingLeft: 3, paddingTop: 2 }}
                onPress={() =>
                  props.navigation.navigate('Receipt Form', {
                    current: receiptValue,
                    navigation: props.navigation,
                    userId: userValues[0].id,
                    email: currentUser.email,
                  })
                }
              />
              <View style={styles.info}>
                <Text style={styles.receiptInfo}>
                  {receiptValue.restaurant}
                </Text>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: '15',
                    justifyContent: 'center',
                  }}
                >
                  {new Date(receiptValue.date).toLocaleDateString('en-US')}
                </Text>
              </View>
              <Icon
                name="md-person-add"
                style={{ color: '#3d403d', paddingRight: 3, paddingTop: 2 }}
                onPress={() =>
                  props.navigation.navigate('Add User', {
                    receipt: receiptValue,
                  })
                }
              />
            </View>
          ) : (
            <View style={styles.info2}>
              <Text style={styles.receiptInfo2}>{receiptValue.restaurant}</Text>
            </View>
          )}
          <Text>{comments.restaurant}</Text>
          <Text>{comments.misc}</Text>
          <Text style={styles.receiptInfo}>{comments.date}</Text>
          <View style={styles.costInfo}>
            <Text style={styles.costText}>
              My Subtotal: ${Math.floor(calcSubtotal()) / 100}
            </Text>
            <Text style={styles.costText}>
              My Tax: $
              {(
                Math.floor(
                  (calcSubtotal() / receiptValue.total) * receiptValue.tax
                ) / 100
              ).toFixed(2)}
            </Text>
            {receiptValue.tip === 0 ? null : (
              <Text style={styles.costText}>
                My Tip: $
                {(
                  Math.floor(
                    (calcSubtotal() / receiptValue.total) * receiptValue.tip
                  ) / 100
                ).toFixed(2)}
              </Text>
            )}
          </View>
          {!loadingState && (
            <FlatList
              data={receiptItems}
              renderItem={itemInfo => (
                <ItemCard
                  itemInfo={itemInfo}
                  receiptUser={currentUser}
                  key={itemInfo.key}
                  presser={tapItem}
                />
              )}
            ></FlatList>
          )}
          {receiptValue.owner == userValues[0].email ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button style={styles.completeButton}>
                <Text>Complete</Text>
              </Button>
              <Button
                style={styles.completeButton}
                onPress={() =>
                  props.navigation.navigate('Summary', {
                    receipt: receiptValue,
                  })
                }
              >
                <Text>View Summary</Text>
              </Button>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button style={styles.payoutButton}>
                <Text>Payout</Text>
              </Button>
            </View>
          )}
        </Content>
      )}
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 2,
    marginLeft: 2,
    marginTop: 20,
  },
  receiptInfo: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 2,
    color: 'black',
  },
  receiptInfo2: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 5,
    color: 'black',
  },
  costText: {
    fontSize: 13.5,
    color: 'white',
  },
  costInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#3D9970',
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 6,
    height: 33,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  info2: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    height: 33,
    width: 140,
  },
  payoutButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    height: 33,
    width: 140,
  },
});
