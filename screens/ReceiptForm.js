import * as WebBrowser from 'expo-web-browser';
import React from 'react';
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
import { editReceipt, addReceiptItems } from '../src/tools/firebase';

export default class ReceiptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.navigation.getParam('current').items,
      name: '',
      amount: 0,
      subtotal: this.props.navigation.getParam('current').subtotal,
      tax: this.props.navigation.getParam('current').tax,
      tip: 0,
      total: this.props.navigation.getParam('current').total,
    };
    this.handleCreateNewItem = this.handleCreateNewItem.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleNameText = this.handleNameText.bind(this);
    this.handleAmountText = this.handleAmountText.bind(this);
  }

  updateTotal(tip) {
    this.setState({ tip: Number(tip) });
    const total = this.state.tip + this.state.subtotal + this.state.tax;
    this.setState({
      total: total,
    });
  }

  handleNameText(name) {
    this.setState({ name });
  }

  handleAmountText(amount) {
    this.setState({ amount });
  }

  async handleCreateNewItem(event) {
    event.preventDefault();
    const receiptId = await this.props.navigation.state.params.current.id;
    let newItem = { name: this.state.name, amount: this.state.amount };
    this.setState({
      items: this.state.items.concat(newItem),
      total: this.state.total + Number(newItem.amount),
      subtotal: this.state.subtotal + Number(newItem.amount),
    });
    let addItemsToReceipt = await addReceiptItems(receiptId, newItem);
    this.setState({
      name: '',
      amount: 0,
    });
  }

  async handleComplete() {
    const receiptId = await this.props.navigation.state.params.current.id;
    let updatedReceipt = await editReceipt(
      receiptId,
      this.state.tip,
      this.state.total,
      this.state.subtotal
    );
    this.props.navigation.navigate('CurrentReceipt', {
      current: receiptId,
      // navigation: this.props.navigation,
    });
  }

  render() {
    let owner = this.props.navigation.getParam('current').owner;
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <TextInput
                type="text"
                name="name"
                placeholder="name"
                onChangeText={name => this.handleNameText(name)}
                value={this.state.name}
              />
            </Item>
            <Item>
              <TextInput
                type="newItem.amount"
                name="amount"
                placeholder="amount"
                onChangeText={amount => this.handleAmountText(amount)}
                value={this.state.amount}
              />
            </Item>

            <Button small rounded success onPress={this.handleCreateNewItem}>
              <Icon name="add" />
            </Button>
            <Item>
              <Input
                placeholder="tip"
                onChangeText={tip => this.updateTotal(tip)}
              />
            </Item>
          </Form>
          {this.state.items.map(item => (
            <ItemCard item={item} key={item.id} />
          ))}
          <Text>Owner: {owner}</Text>
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
