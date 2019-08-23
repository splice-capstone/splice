import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {
  Container,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  View,
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
      tip: this.props.navigation.getParam('current').tip / 100,
      total: this.props.navigation.getParam('current').total,
    };
    this.handleCreateNewItem = this.handleCreateNewItem.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleNameText = this.handleNameText.bind(this);
    this.handleAmountText = this.handleAmountText.bind(this);
  }

  updateTotal(tip) {
    let tipInput = Number(tip);
    this.setState({ tip: tipInput });
    const total = tipInput * 100 + this.state.subtotal + this.state.tax;
    this.setState({
      total: total,
    });
  }

  handleNameText(name) {
    this.setState({ name: name.toLowerCase() });
  }

  handleAmountText(amount) {
    this.setState({ amount });
  }

  async handleCreateNewItem(event) {
    event.preventDefault();
    const receiptId = await this.props.navigation.getParam('current').id;
    let newItem = { name: this.state.name, amount: this.state.amount * 100 };
    this.setState({
      items: this.state.items.concat(newItem),
      total: this.state.total + Number(newItem.amount),
      subtotal: this.state.subtotal + Number(newItem.amount),
    });
    await addReceiptItems(receiptId, newItem);
    this.setState({
      name: '',
      amount: 0,
    });
  }

  async handleComplete() {
    const receiptId = await this.props.navigation.getParam('current').id;
    await editReceipt(
      receiptId,
      this.state.tip * 100,
      this.state.total,
      this.state.subtotal
    );
    this.props.navigation.navigate('CurrentReceipt', {
      current: receiptId,
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 20,
              }}
            >
              <Item>
                <TextInput
                  type="text"
                  name="name"
                  placeholder="item name"
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
            </View>
            <View style={{ height: 30, justifyContent: 'center' }}>
              <Button
                title="add item"
                textAlign="center"
                backgroundColor="#3D9970"
                small
                rounded
                success
                onPress={this.handleCreateNewItem}
              >
                {/* <Icon name="add" /> */}
                <Text style={{ textAlign: 'center' }}>add item</Text>
              </Button>
            </View>
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
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Text>Subtotal: ${this.state.subtotal / 100}</Text>
            <Text>Tax: ${this.state.tax / 100}</Text>
            <Text>Tip: ${this.state.tip} </Text>
            <Text>Total: ${this.state.total / 100}</Text>
          </View>
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
  addItemButton: {
    backgroundColor: '#3D9970',
  },
});
