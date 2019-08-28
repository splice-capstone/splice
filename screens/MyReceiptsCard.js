/* eslint-disable complexity */
import React from 'react';
import { View, Linking } from 'react-native';
import {
  Header,
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import { WebBrowser } from 'expo';

const MyReceiptsCard = props => {
  const { restaurant, date, id, total, owner, open } = props.recptsData;
  const {
    myDetails: { isOwner, paid },
  } = props.recptsData;

  const totalInDollars = total / 100;

  const handleOpenWithWebBrowser = function() {
    WebBrowser.openBrowserAsync('https://venmo.com/account/sign-in');
  };

  const handleOpenWithLinking = function() {
    Linking.openURL('https://venmo.com/account/sign-in');
  };

  return (
    <Card style={{ flex: 0, height: 140 }} onPress>
      <CardItem>
        <Left>
          <Body>
            <Text style={{ fontSize: 20 }}>{restaurant}</Text>
            <Text note>{new Date(date).toLocaleDateString('en-US')}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem>
        <Left>
          <Body>
            {isOwner ? (
              <Text
                style={
                  paid
                    ? { color: 'green', fontSize: 13 }
                    : { color: 'red', fontSize: 13 }
                }
              >
                {`${
                  paid
                    ? `Received $${totalInDollars}`
                    : `Receiving $${totalInDollars}`
                }`}
              </Text>
            ) : (
              <Text
                style={
                  paid
                    ? { color: 'green', fontSize: 13 }
                    : { color: 'red', fontSize: 13 }
                }
              >
                {`${paid ? 'Paid' : 'Need to pay'}: ${owner}`}
              </Text>
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
                    // onPress={() => {
                    //   // placeholder to navigate to paypal
                    //   props.navigation.navigate('Add User', {
                    //     receipt: props.recptsData,
                    //   });
                    // }}
                    onPress={handleOpenWithWebBrowser}
                  >
                    <Icon
                      type="MaterialCommunityIcons"
                      name="venmo"
                      padding="2"
                    />
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
                    <Icon type="Entypo" name="info" />
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
                    <Icon type="MaterialCommunityIcons" name="venmo" />
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
                    <Icon type="Entypo" name="info" />
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
