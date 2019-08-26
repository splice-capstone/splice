/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useStateValue } from '../state';
import ItemCard from './ItemCard';
import { Container, Content, Button, Icon, Text, View } from 'native-base';

import {
  useDocumentData,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import db, { calculateSubtotal } from '../src/tools/firebase';

export default function CurrentReceipt(props) {
  const [{ currentUser }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');
  const [userSubtotal, setSubtotal] = useState(0);
  const [userTax, setTax] = useState(0);
  const [userTip, setTip] = useState(0);
  const [userTotal, setTotal] = useState(0);

  const receiptId = props.navigation.getParam(
    'receiptId',
    'J6DOUzP2OGdcger73ciF'
  );

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
      setTax(
        Math.floor(
          ((userSubtotal / receiptValue.total) * receiptValue.tax) / 100
        )
      );
      //calculate user tip based on user subtotal/overall total * overall tip
      setTip(
        Math.floor(
          ((userSubtotal / receiptValue.total) * receiptValue.tip) / 100
        )
      );
      //calculate user total based on user subtotal + user tax + user tip
      setTotal(Math.floor(userSubtotal + userTax + userTip));
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

  if (receiptValue && userValues) {
    if (receiptValue.owner == currentUser.email) {
      return (
        <Container>
          {(receiptError || userError) && (
            <Text>Error: {JSON.stringify(receiptError)}</Text>
          )}
          {(receiptLoading || userLoading) && (
            <Text>Collection: Loading...</Text>
          )}
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
            <Text>Id: {receiptValue.id}</Text>
            <Text>Date: {receiptValue.date}</Text>
            <Text>Owner: {receiptValue.owner}</Text>
            <Text>Subtotal: ${receiptValue.subtotal / 100}</Text>
            <Text>Tax: ${receiptValue.tax / 100}</Text>
            <Text>Tip: ${receiptValue.tip / 100} </Text>
            <Text>Total: ${receiptValue.total / 100}</Text>
            <Text>My Subtotal: ${userSubtotal}</Text>
            <Text>My Tax: ${userTax}</Text>
            <Text>My Tip: ${userTip}</Text>
            <Text>My Total: ${userTotal}</Text>
            <ItemCard
              receiptId={props.navigation.getParam(
                'receiptId',
                'jbIXS3uNWk0VGEZWqcdP'
              )}
              receiptUserId={userValues[0].id}
            />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          {(receiptError || userError) && (
            <Text>Error: {JSON.stringify(receiptError)}</Text>
          )}
          {(receiptLoading || userLoading) && (
            <Text>Collection: Loading...</Text>
          )}
          <Content>
            <Text
              style={{
                fontWeight: '600',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {receiptValue.restaurant}
            </Text>
            <Text>{comments.restaurant}</Text>
            <Text>{comments.misc}</Text>
            <Text>{comments.date}</Text>
            <Text>Id: {receiptValue.id}</Text>
            <Text>Date: {receiptValue.date}</Text>
            <Text>Owner: {receiptValue.owner}</Text>
            <Text>Subtotal: ${receiptValue.subtotal / 100}</Text>
            <Text>Tax: ${receiptValue.tax / 100}</Text>
            <Text>Tip: ${receiptValue.tip / 100} </Text>
            <Text>Total: ${receiptValue.total / 100}</Text>
            <Text>My Subtotal: ${userSubtotal}</Text>
            <Text>My Tax: ${userTax}</Text>
            <Text>My Tip: ${userTip}</Text>
            <Text>My Total: ${userTotal}</Text>
            <ItemCard
              receiptId={props.navigation.getParam(
                'receiptId',
                'jbIXS3uNWk0VGEZWqcdP'
              )}
              receiptUserId={userValues[0].id}
            />
          </Content>
        </Container>
      );
    }
  }
  return null;
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
