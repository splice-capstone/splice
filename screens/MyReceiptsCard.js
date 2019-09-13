import React from 'react';
import { View } from 'react-native';
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
import * as WebBrowser from 'expo-web-browser';
import Bar from '../assets/shapes/triangleBar';

const MyReceiptsCard = props => {
  const { restaurant, date, id, total, owner, open } = props.recptsData;
  const {
    myDetails: { isOwner, paid },
  } = props.recptsData;

  const totalInDollars = total / 100;

  const _handleOpenWithWebBrowser = function() {
    WebBrowser.openBrowserAsync('https://venmo.com/');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        marginTop: '5%',
      }}
    >
      <Card
        style={{
          flex: 1,
          width: '70%',
          borderBottomColor: 'transparent',
          zIndex: 0,
        }}
      >
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
                    !open
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
                      onPress={_handleOpenWithWebBrowser}
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
                      <Icon type="Entypo" name="info" padding="2" />
                    </Button>
                  </Right>
                </CardItem>
              ) : (
                <CardItem>
                  <Left>
                    <Button
                      transparent
                      textStyle={{ color: '#87838B' }}
                      onPress={_handleOpenWithWebBrowser}
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
              )}
            </Body>
          </Left>
        </CardItem>
      </Card>

      <Bar></Bar>
    </View>
  );
};

export default MyReceiptsCard;
