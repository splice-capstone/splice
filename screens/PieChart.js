import {
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryLegend,
  VictoryLabel,
  VictoryContainer,
} from 'victory-native';
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
              paid,
              photoUrl,
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
          marginTop: 30,
        }}
      >
        Paid
      </Title>
      <VictoryContainer
        style={{ labels: { fontSize: 15 }, parent: { width: 100 } }}
      >
        <VictoryPie
          data={paidArr}
          x="name"
          y="total"
          innerRadius={90}
          style={{ labels: { fontSize: 15 }, parent: { width: 100 } }}
          labels={d => `$${d.data[d.index].total} - ${d.data[d.index].xName}`}
          labelRadius={({ innerRadius }) => innerRadius + 5}
          colorScale={['#44CFCB', '#B8CDF8', '#95F2D9', '#9D8DF1', '#E0ACD5']}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 20 }}
          x={185}
          y={185}
          text={`Total: $${Math.floor(receipt.total / 100)}`}
        />
      </VictoryContainer>
      {remainingArr.length ? (
        <Title
          center
          style={{
            marginTop: 60,
          }}
        >
          Need to pay
        </Title>
      ) : (
        <Title
          center
          style={{
            marginTop: 60,
          }}
        >
          Everyone has paid!
        </Title>
      )}
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
