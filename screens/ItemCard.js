import React from 'react';
import { ListItem, CheckBox, Text, Body } from 'native-base';

export default function ItemCard(props) {
  return (
    <ListItem>
      <CheckBox checked={true} />
      <Body>
        <Text>
          {props.item.name} ${props.item.amount}
        </Text>
      </Body>
    </ListItem>
  );
}
