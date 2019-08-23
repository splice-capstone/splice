import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Button, Icon, Text, View } from 'native-base';
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
      'BPG1dyK2xu41UEahdMG6'
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
                navigation: props.navigation,
              })
            }
          >
            edit
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
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text>Date: {currentReceipt.date}</Text>
          <Text>Owner: {currentReceipt.owner}</Text>
          <Text>Subtotal: ${currentReceipt.subtotal / 100}</Text>
          <Text>Tax: ${currentReceipt.tax / 100}</Text>
          <Text>Tip: ${currentReceipt.tip / 100}</Text>
          <Text>Total: ${currentReceipt.total / 100}</Text>
        </View>
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
