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
        maxWidth: '100%',
        minHeight: 65,
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
          width: '70%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Left style={{ flex: 2 }}>
          <Text style={theStyle}>{itemData.name.toUpperCase()}</Text>
        </Left>
        <Right
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <Text style={theStyle}>
            @ {`$${(itemData.costPerUser / 100).toFixed(2)}/ea`}
          </Text>
        </Right>
      </View>
      <View
        style={{
          width: '30%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            textAlign: 'right',
            paddingLeft: '7.5%',
          }}
        >
          {photoArr.map(photoUri => {
            return (
              <Thumbnail
                style={{ marginRight: '-18.5%' }}
                key={photoUri}
                small
                source={{ uri: photoUri }}
              />
            );
          })}
        </View>
      </View>
    </ListItem>
  );
}

theStyle = {
  fontSize: 12,
};
