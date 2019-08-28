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
  Icon,
} from 'native-base';
import ItemCardEdit from './ItemCardEdit';
import { editReceipt, addReceiptItems } from '../src/tools/firebase';

export default class ReceiptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      amount: '',
      subtotal: this.props.navigation.getParam('current').subtotal,
      tax: this.props.navigation.getParam('current').tax,
      tip: this.props.navigation.getParam('current').tip / 100,
      total: this.props.navigation.getParam('current').total,
    };
    this.handleCreateNewItem = this.handleCreateNewItem.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  updateTotal(tip) {
    let tipInput = Number(tip);
    this.setState({ tip: tipInput });
    const total = tipInput * 100 + this.state.subtotal + this.state.tax;
    this.setState({
      total: total,
    });
  }

  handleNameText = name => {
    this.setState({ name });
  };

  handleAmountText = amount => {
    this.setState({ amount });
  };

  handleTipInput = tipAmount => {
    this.setState({ tip: tipAmount });
  };

  async handleCreateNewItem(event) {
    event.preventDefault();
    const receiptId = await this.props.navigation.getParam('current').id;
    let newItem = {
      name: this.state.name,
      amount: Number(this.state.amount) * 100,
      payees: { [this.props.navigation.getParam('email')]: false },
    };
    this.setState({
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
    this.props.navigation.navigate('Current Receipt', {
      current: receiptId,
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <View style={styles.inputView}>
              <Item>
                <TextInput
                  type="text"
                  name="name"
                  placeholder="i t e m  n a m e"
                  onChangeText={name => this.handleNameText(name)}
                  value={this.state.name}
                />
              </Item>
              <Item>
                <TextInput
                  type="number"
                  name="amount"
                  placeholder="a m o u n t"
                  onChangeText={amount => this.handleAmountText(amount)}
                  value={this.state.amount}
                />
              </Item>
              <Button
                title="add item"
                textAlign="center"
                backgroundColor="#3D9970"
                small
                rounded
                onPress={this.handleCreateNewItem}
              >
                <Icon type="Ionicons" name="ios-add" />
              </Button>
            </View>
          </Form>
          <ItemCardEdit
            receiptId={this.props.navigation.getParam('current').id}
            receiptUserId={this.props.navigation.getParam('userId')}
          />
          <View
            style={{
              marginTop: 14,
              marginBottom: 14,
              marginLeft: 5,
            }}
          >
            <View style={styles.tipInfo}>
              <Input
                style={{ height: 20 }}
                placeholder="e n t e r  t i p"
                onChangeText={tipAmount => this.updateTotal(tipAmount)}
              />
            </View>
            <Text style={styles.generalText}>
              Subtotal: ${this.state.subtotal / 100}
            </Text>
            <Text style={styles.generalText}>Tax: ${this.state.tax / 100}</Text>
            <Text style={styles.generalText}>Tip: ${this.state.tip} </Text>
            <Text style={styles.generalText}>
              Total: ${this.state.total / 100}
            </Text>
          </View>
          <Button
            style={styles.finishButton}
            onPress={() => this.handleComplete()}
          >
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
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    padding: 10,
  },
  finishButton: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    height: 33,
    width: 150,
    marginLeft: '29%',
  },
  tipInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '30%',
    padding: 10,
  },
  generalText: {
    color: '#3A3535',
    padding: 2,
    fontWeight: '300',
  },
});
