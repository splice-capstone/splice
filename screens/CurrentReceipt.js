import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useStateValue } from '../state';
import ItemCard from './ItemCard';
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Title,
  View,
} from 'native-base';

import {
  useDocumentData,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import db, { calculateSubtotal } from '../src/tools/firebase';
import { ScrollView } from 'react-native-gesture-handler';

export default function CurrentReceipt(props) {
  const [{ currentUser }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');
  const [userSubtotal, setSubtotal] = useState(0);
  const [userTax, setTax] = useState(0);
  const [userTip, setTip] = useState(0);
  const [userTotal, setTotal] = useState(0);

  const receiptId = props.navigation.getParam(
    'receiptId',
    'Sd5SAIYhhN7VWwmSNIBk'
  );

  if (!currentUser.email) {
    currentUser.email = 'amandamarienelson2@gmail.com';
  }

  useEffect(() => {
    const newComments = props.navigation.getParam('comments', '');
    if (newComments) {
      setComments(newComments);
    }
    if (userValues && receiptValue && userValues[0].id) {
      //recalculate my user subtotals based on sum of my items map
      calculateSubtotal(receiptId, userValues[0].id).then(subtotal =>
        setSubtotal(subtotal / 100)
      );
      //calculate user tax based on user subtotal/overall total * overall tax
      setTax(((userSubtotal / receiptValue.total) * receiptValue.tax) / 100);
      //calculate user tip based on user subtotal/overall total * overall tip
      setTip(((userSubtotal / receiptValue.total) * receiptValue.tip) / 100);
      //calculate user total based on user subtotal + user tax + user tip
      setTotal(userSubtotal + userTax + userTip);
    }
  });

  const [receiptValue, receiptLoading, receiptError] = useDocumentData(
    db.collection('receipts').doc(receiptId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: 'id',
    }
  );

  // listen on receipt_users doc that emails current user email
  const [userValues, userLoading, userError] = useCollectionData(
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

  return (
    <Container>
      {(receiptError || userError) && (
        <Text>Error: {JSON.stringify(receiptError)}</Text>
      )}
      {(receiptLoading || userLoading) && <Text>Collection: Loading...</Text>}
      {receiptValue && userValues && (
        <Content>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-evenly',
            }}
          >
            <Button>
              <Text
                onPress={() =>
                  props.navigation.navigate('Receipt Form', {
                    current: receiptValue,
                    navigation: props.navigation,
                    userId: userValues[0].id,
                    email: currentUser.email,
                  })
                }
              >
                Edit
              </Text>
            </Button>
            <Text
              style={{
                fontWeight: '600',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {receiptValue.restaurant}
            </Text>
            <Text>
              {new Date(receiptValue.date).toLocaleDateString('en-US')}
            </Text>
            <Button>
              <Icon
                name="md-person-add"
                onPress={() =>
                  props.navigation.navigate('Add User', {
                    receipt: receiptValue,
                  })
                }
              />
            </Button>
          </View>

          <Text>{comments.restaurant}</Text>
          <Text>{comments.misc}</Text>
          <Text>{comments.date}</Text>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-evenly',
              backgroundColor: '#3D9970',
              padding: 10,
            }}
          >
            <Text light>My Subtotal: ${userSubtotal}</Text>
            <Text light>My Tax: ${userTax}</Text>
            <Text light>My Tip: ${userTip}</Text>
          </View>
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            My Total: ${userTotal}
          </Text>

          <ScrollView>
            <ItemCard
              receiptId={props.navigation.getParam(
                'receiptId',
                'Sd5SAIYhhN7VWwmSNIBk'
              )}
              receiptUserId={userValues[0].id}
            />
          </ScrollView>

          <Text>Owner: {receiptValue.owner}</Text>
          <Text>Subtotal: ${receiptValue.subtotal / 100}</Text>
          <Text>Tax: ${receiptValue.tax / 100}</Text>
          <Text>Total: ${receiptValue.total / 100}</Text>
          <Button>
            <Text center light>
              COMPLETE
            </Text>
          </Button>
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
  contentContainer: {
    paddingTop: 30,
  },
  header: {
    marginTop: 10,
    fontSize: 18,
  },
});
