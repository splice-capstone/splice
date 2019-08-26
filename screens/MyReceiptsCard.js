/* eslint-disable complexity */
import React from 'react';
import { View } from 'react-native';
import {
  Header,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import PayPal from './PayPal';

const MyReceiptsCard = props => {
  const { restaurant, date, id, total, owner } = props.recptsData;
  const {
    myDetails: { isOwner, paid },
  } = props.recptsData;

  const totalInDollars = total / 100;
  return (
    <Card style={{ flex: 0 }} onPress>
      <CardItem>
        <Left>
          <Body>
            <Text>{restaurant}</Text>
            <Text note>{new Date(date).toLocaleDateString('en-US')}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem>
        <Left>
          <Body>
            {isOwner ? (
              <Text style={paid ? { color: 'green' } : { color: 'red' }}>{`${
                paid
                  ? `Received $${totalInDollars}`
                  : `Receiving $${totalInDollars}`
              }`}</Text>
            ) : (
              <Text style={paid ? { color: 'green' } : { color: 'red' }}>{`${
                paid ? 'Paid' : 'Need to pay'
              }: ${owner}`}</Text>
            )}
          </Body>
        </Left>
      </CardItem>
      <CardItem>
        <Left>
          <Body>
            {isOwner ? (
              <CardItem>
                <Left>
                  <Button
                    transparent
                    textStyle={{ color: '#87838B' }}
                    onPress={() => {
                      // placeholder to navigate to paypal
                      props.navigation.navigate('Add User', {
                        receipt: props.recptsData,
                      });
                    }}
                  >
                    <Icon type="Entypo" name="user" />
                  </Button>
                </Left>
                <Right>
                  <Button
                    transparent
                    textStyle={{ color: '#87838B' }}
                    onPress={() => {
                      props.navigation.navigate('Current Receipt', {
                        receiptId: id,
                      });
                    }}
                  >
                    <Icon type="Entypo" name="arrow-bold-right" />
                  </Button>
                </Right>
              </CardItem>
            ) : (
              <CardItem>
                <Left>
                  <Button
                    transparent
                    textStyle={{ color: '#87838B' }}
                    onPress={() => {
                      // placeholder to navigate to paypal
                    }}
                  >
                    <Icon type="Entypo" name="paypal" />
                  </Button>
                </Left>
                <Right>
                  <Button
                    transparent
                    textStyle={{ color: '#87838B' }}
                    onPress={() => {
                      props.navigation.navigate('Current Receipt', {
                        receiptId: id,
                      });
                    }}
                  >
                    <Icon type="Entypo" name="arrow-bold-right" />
                  </Button>
                </Right>
              </CardItem>
            )}
          </Body>
        </Left>
      </CardItem>
    </Card>
  );
};

export default MyReceiptsCard;
