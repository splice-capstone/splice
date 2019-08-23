import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useStateValue } from '../state';
import { getReceipt } from '../src/tools/firebase';
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
  View,
  Thumbnail,
} from 'native-base';

export default function CurrentReceipt(props) {
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();
  const [comments, setComments] = useState('');

  const setCurrentReceipt = receipt => {
    dispatch({ type: 'SET_RECEIPT', receipt });
  };

  useEffect(() => {
    const receiptId = props.navigation.getParam(
      'receiptId',
      'BPG1dyK2xu41UEahdMG6'
    );
    const newComments = props.navigation.getParam('comments', '');
    if (newComments) {
      setComments(newComments);
    }
    if (currentReceipt.id !== receiptId) {
      getReceipt(receiptId).then(receipt => {
        setCurrentReceipt(receipt);
      });
    }
  });

  return (
    <Container>
      <Content>
        <View>
          <Button
            onPress={() =>
              props.navigation.navigate('Receipt Form', {
                current: currentReceipt,
                navigation: props.navigation,
              })
            }
          >
            <Icon name="add" />
          </Button>
          <Button onPress={() => props.navigation.navigate('Add User')}>
            <Icon name="md-person-add" />
          </Button>
        </View>
        <Text>{comments.restaurant}</Text>
        <Text>{comments.misc}</Text>
        <Text>{comments.date}</Text>
        <Text>{currentReceipt.restaurant}</Text>

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
        <View>
          {currentReceipt.users.map(user => {
            <List key={user.email}>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{ uri: user.photoUrl }} />
                </Left>
                <Body>
                  <Text>{user.name}</Text>
                  <Text note>{user.email}</Text>
                </Body>
              </ListItem>
            </List>;
          })}
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
