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
import { useStateValue, StateContext } from '../state';
import ItemCard from './ItemCard';
import { editReceipt } from '../src/tools/firebase';

export default class ReceiptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.navigation.getParam('current').items,
      newItem: {
        name: '',
        amount: 0,
      },
      owner: this.props.navigation.getParam('current').owner,
      subtotal: this.props.navigation.getParam('current').subtotal / 100,
      tax: this.props.navigation.getParam('current').tax / 100,
      tip: 0,
      total: this.props.navigation.getParam('current').total / 100,
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    // this.updateItems = this.updateItems.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  async updateTotal(tip) {
    this.setState({ tip: Number(tip) });
    const total =
      (await this.state.tip) * 10 + this.state.subtotal + this.state.tax;
    this.setState({
      total: total,
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  // updateItems(item) {
  //   this.setState({
  //     items: [...this.state.items, item],
  //   });
  // }

  // handleClick(event, item) {
  //   event.preventDefault();
  //   const itemsAdded = this.state.items.concat(item);
  //   this.setState({ items: itemsAdded });
  // }

  // handleChange(event) {
  //   this.setState(prevState => ({
  //     items: prevState.items.concat({ name: event.target.value }),
  //   }));
  // }
  // handleSubmit(event, item) {
  //   event.preventDefault();
  //   this.updateItems(item);
  // }

  async handleComplete() {
    console.log('hi');
    const receiptId = await this.props.navigation.state.params.current.id;
    console.log('8888', receiptId);
    let updatedReceipt = await editReceipt(
      receiptId,
      this.state.tip,
      this.state.total
    );
    console.log('updatedReceipt', updatedReceipt);
  }

  render() {
    // const receiptId = this.props.navigation.state.params.current.id;
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input
                placeholder="name"
                onChange={tip => this.updateTotal(tip)}
              />
            </Item>
            <Item>
              <Input
                placeholder="amount"
                onChange={tip => this.updateTotal(tip)}
              />
            </Item>
            <Item>
              <Input
                placeholder="tip"
                onChangeText={tip => this.updateTotal(tip)}
              />
            </Item>
            <Button small rounded success onPress={console.log('hey!')}>
              <Icon name="add" />
            </Button>
            {/* <Item>
              <Input
                type="text"
                placeholder="name"
                onChangeText={name => this.updateItems({ name: name })}
              />
            </Item>
            <Button small rounded success>
              <Icon name="add" />
            </Button> */}
          </Form>
          {this.state.items.map(item => (
            <ItemCard item={item} key={item.id} />
          ))}
          <Text>Owner: {this.state.owner}</Text>
          <Text>Subtotal: ${this.state.subtotal}</Text>
          <Text>Tax: ${this.state.tax}</Text>
          <Text>Tip: ${this.state.tip} </Text>
          <Text>Total: ${this.state.total}</Text>
          <Button small rounded danger onPress={() => this.handleComplete()}>
            <Text>finish</Text>
          </Button>
        </Content>
      </Container>
    );
  }
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

// let receiptId = await updateReceipt()
// and redirect to current recept page
