import { PieChart } from 'react-native-chart-kit';
import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import db from '../src/tools/firebase';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Text,
  Icon,
  Title,
  Item,
} from 'native-base';
import randomColor from 'randomcolor';

const SummaryPieChart = props => {
  const [paidArr, setPaidArr] = useState([]);
  const [remainingArr, setRemainingArr] = useState([]);

  const receipt = props.navigation.getParam('receipt');

  useEffect(() => {
    const unsub = db
      .collection('receipts')
      .doc(receipt.id)
      .collection('receipt_users')
      .onSnapshot(snap => {
        let sum = 0;
        let paidUsers = [];
        let remainingUsers = [];
        snap.forEach(userDoc => {
          const {
            name,
            total,
            email,
            isOwner,
            paid,
            photoUrl,
          } = userDoc.data();

          if (paid) {
            paidUsers.push({
              name: name.split(' ')[0],
              total: Math.floor(total / 100),
              email,
              isOwner,
              paid,a\
              photoUrl,
              color: randomColor({
                hue: 'green',
              }),
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            });
            sum += total;
          } else if (!isOwner && !paid) {
            remainingUsers.push({
              name: name.split(' ')[0],
              total: Math.floor(total / 100),
              email,
              isOwner,
              paid,
              photoUrl,
            });
          }
        });
        if (receipt.total - sum > 0) {
          paidUsers.push({
            name: 'Remaining',
            total: Math.floor((receipt.total - sum) / 100),
            color: '#3D9970',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          });
        }

        setRemainingArr(remainingUsers);
        setPaidArr(paidUsers);
      });
    return () => unsub();
  }, []);

  return (
    <Content>
      <Title
        style={{
          marginTop: 60,
        }}
      >
        Paid
      </Title>
      <PieChart
        data={paidArr}
        width={Dimensions.get('window').width - 50}
        height={200}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 1,
          },
        }}
        accessor="total"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute //for the absolute number remove if you want percentage
      />
      <Text center>Total: ${Math.floor(receipt.total / 100)}</Text>
      <Title
        center
        style={{
          marginTop: 60,
        }}
      >
        Left to pay
      </Title>
      {remainingArr &&
        remainingArr.map(user => (
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
          </List>
        ))}
    </Content>
  );
};

export default SummaryPieChart;