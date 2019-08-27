import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Content,
  Text,
  ListItem,
  Left,
  Right,
  Thumbnail,
  View,
} from 'native-base';

export default function ItemCard(props) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
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

  const itemData = props.itemInfo.item;

  let photoArr = [];

  for (let [key, value] of Object.entries(itemData.payees)) {
    if (value.isPayee) {
      photoArr.push(value.photo);
    }
  }

  return (
    <ListItem
      noIdent
      style={{
        backgroundColor: 'white',
        flex: 1,
        minHeight: '100%',
        justifyContent: 'space-between',
        fontFamily: 'Feather',
      }}
      onPress={() =>
        props.presser(
          props.receiptUser,
          itemData.key,
          itemData.payees,
          itemData.amount
        )
      }
    >
      <View
        style={{
          // // flex: 2,
          flexDirection: 'row',
          padding: 2,
          minWidth: '100%',
        }}
      >
        <Left
          style={{
            flex: 2,
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Text style={{ color: '#3A3535' }}>{itemData.name}</Text>
          <Text style={{ marginRight: '0%', color: '#3A3535' }}>
            {' '}
            @ {`$${itemData.costPerUser / 100}/ea`}
          </Text>
        </Left>
        <Right
          style={{
            flex: 1.25,
            flexDirection: 'row',
          }}
        >
          {photoArr.map(photoUri => {
            return (
              <Thumbnail
                style={{ marginRight: '-10.5%' }}
                key={photoUri}
                small
                source={{ uri: photoUri }}
              />
            );
          })}
        </Right>
      </View>
    </ListItem>
  );
}
