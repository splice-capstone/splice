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
} from 'native-base';
import { useStateValue } from '../state';
import { getReceipt } from '../src/tools/firebase';
import ItemCard from './ItemCard';

export default function CurrentReceipt(props) {
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');

  const setCurrentReceipt = receipt => {
    dispatch({ type: 'SET_RECEIPT', receipt });
  };

  useEffect(() => {
    const receiptId = props.navigation.getParam(
      'receiptId',
      'jbIXS3uNWk0VGEZWqcdP'
    );
    const newComments = props.navigation.getParam('comments', '');
    if (newComments) {
      setComments(newComments);
    }
    if (!currentReceipt.id) {
      getReceipt(receiptId).then(receipt => {
        setCurrentReceipt(receipt);
      });
    }
  });

  return (
    <Container>
      <Content>
        <Button>
          <Text>{comments.restaurant}</Text>
          <Text>{comments.misc}</Text>
          <Text>{comments.date}</Text>

          <Text onPress={() => props.navigation.navigate('ReceiptForm')}>
            Edit
          </Text>
          <Text>{currentReceipt.restaurant}</Text>
          <Icon
            name="md-person-add"
            onPress={() => props.navigation.navigate('AddUser')}
          />
        </Button>
        <Text>Id: {currentReceipt.id}</Text>

        <Text>Date: {currentReceipt.date}</Text>
        <Text>Owner: {currentReceipt.owner}</Text>
        <Text>Subtotal: ${currentReceipt.subtotal}</Text>
        <Text>Tax: ${currentReceipt.tax}</Text>
        <Text>Total: ${currentReceipt.total}</Text>
        {currentReceipt.items.map(item => (
          <ItemCard item={item} key={item.id} />
        ))}
      </Content>
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
