import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Form,
  Item,
  Input,
} from 'native-base';
import ItemCard from './ItemCard';
import { editReceipt } from '../src/tools/firebase';

export default class NewItem extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input placeholder="name" />
            </Item>
            <Item>
              <Input placeholder="amount" />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
