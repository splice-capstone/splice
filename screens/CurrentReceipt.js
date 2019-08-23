import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Form,
  Item,
  Input,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';

import { useStateValue } from '../state';
import { getReceipt } from '../src/tools/firebase';
import ItemCard from './ItemCard';
import {
  useDocumentData,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import db from '../src/tools/firebase';

export default function CurrentReceipt(props) {
  const [{ currentUser }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');

  const receiptId = props.navigation.getParam(
    'receiptId',
    '1Y8k9OAQhJAlctRTAjYW'
  );
  useEffect(() => {
    const newComments = props.navigation.getParam('comments', '');
    if (newComments) {
      setComments(newComments);
    }
  }, []);

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
          <Button>
            <Text>{comments.restaurant}</Text>
            <Text>{comments.misc}</Text>
            <Text>{comments.date}</Text>

            <Text onPress={() => props.navigation.navigate('Receipt Form')}>
              Edit
            </Text>
            <Text>{receiptValue.restaurant}</Text>
            <Icon
              name="md-person-add"
              onPress={() => props.navigation.navigate('Add User')}
            />
          </Button>
          <Text>Id: {receiptValue.id}</Text>
          <Text>Date: {receiptValue.date}</Text>
          <Text>Owner: {receiptValue.owner}</Text>
          <Text>Subtotal: ${receiptValue.subtotal}</Text>
          <Text>Tax: ${receiptValue.tax}</Text>
          <Text>Total: ${receiptValue.total}</Text>
          <ItemCard
            receiptId={props.navigation.getParam(
              'receiptId',
              'jbIXS3uNWk0VGEZWqcdP'
            )}
            receiptUserId={userValues[0].id}
          />
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
