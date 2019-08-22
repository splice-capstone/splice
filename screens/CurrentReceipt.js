import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Button, Icon, Text } from 'native-base';
import { useStateValue } from '../state';
import { getReceipt } from '../src/tools/firebase';
import ItemCard from './ItemCard';

export default function CurrentReceipt(props) {
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();

  const setCurrentReceipt = receipt => {
    dispatch({ type: 'SET_RECEIPT', receipt });
  };

  useEffect(() => {
    const receiptId = props.navigation.getParam(
      'receiptId',
      '4siHeCfWsI6sTRShkPik'
    );
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
          <Text
            onPress={() =>
              props.navigation.navigate('ReceiptForm', {
                current: currentReceipt,
              })
            }
          >
            Edit
          </Text>
          <Text>{currentReceipt.restaurant}</Text>
          <Icon
            name="md-person-add"
            onPress={() => props.navigation.navigate('AddUser')}
          />
        </Button>
        {currentReceipt.items.map(item => (
          <ItemCard item={item} key={item.id} />
        ))}
        <Text>Date: {currentReceipt.date}</Text>
        <Text>Owner: {currentReceipt.owner}</Text>
        <Text>Subtotal: ${currentReceipt.subtotal}</Text>
        <Text>Tax: ${currentReceipt.tax}</Text>
        <Text>Total: ${currentReceipt.total}</Text>
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
