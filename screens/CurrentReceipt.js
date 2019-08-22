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
import { useDocumentData } from 'react-firebase-hooks/firestore';
import db from '../src/tools/firebase';

export default function CurrentReceipt(props) {
  const [{ currentUser }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');

  const receiptId = props.navigation.getParam(
    'receiptId',
    'jbIXS3uNWk0VGEZWqcdP'
  );
  useEffect(() => {
    const newComments = props.navigation.getParam('comments', '');
    if (newComments) {
      setComments(newComments);
    }
  }, []);

  const watchReceipt = () => {
    console.log('inside watch');
    const [value, loading, error] = useDocumentData(
      db.collection('receipts').doc(receiptId),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
        idField: 'id',
      }
    );
    const receipts = {
      receiptValue: value,
      receiptLoading: loading,
      receiptError: error,
    };
    return receipts;
  };

  // const { receiptValue, receiptLoading, receiptError } = watchReceipt();

  // const watchUserReceipt = () => {
  //   //listen on receipt_users doc that emails current user email
  //   const [value, loading, error] = useCollectionData(
  //     db
  //       .collection('receipts')
  //       .doc(props.receiptId)
  //       .collection('items'),
  //     {
  //       snapshotListenOptions: { includeMetadataChanges: true },
  //       idField: 'id',
  //     }
  //   );
  //   const receipt+
  // };

  return (
    <Container>
      {receiptError && <Text>Error: {JSON.stringify(receiptError)}</Text>}
      {receiptLoading && <Text>Collection: Loading...</Text>}
      {receiptValue && (
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
