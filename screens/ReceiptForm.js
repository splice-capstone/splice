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

export default function ReceiptForm(props) {
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();

  const setCurrentReceipt = receipt => {
    dispatch({ type: 'SET_RECEIPT', receipt });
  };

  return (
    <Container>
      <Header />
      <Content>
        <Form>
          <Item>
            <Input defaultValue={props.receipt} />
          </Item>
          <Item last>
            <Input placeholder="Password" />
          </Item>
          <Button>
            <Icon name="md-person-add" />
            <Text>Edit</Text>
          </Button>
          <Button
            onPress={() => props.navigation.navigate('AddUserToReceiptScreen')}
          >
            <Icon name="md-person-add" />
            <Text>Add Person</Text>
          </Button>
        </Form>
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
