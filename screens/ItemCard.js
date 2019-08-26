import React, { useEffect } from "react";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Form,
  Item,
  Input,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  View
} from "native-base";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db, { updateItem } from "../src/tools/firebase";
import { useStateValue } from "../state";

export default function ItemCard(props) {
  console.log(props.presser);
  return (
    <ListItem
      noIdent
      style={{ backgroundColor: "white" }}
      onPress={() =>
        props.presser(
          props.receiptUser,
          props.itemInfo.item.key,
          props.itemInfo.item.payees
        )
      }
    >
      <Content>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            padding: 2
          }}
        >
          <Text>{props.itemInfo.item.name}</Text>
          <Text>${props.itemInfo.item.amount / 100}</Text>
          <Text>
            {props.itemInfo.item.payees[props.receiptUser.email].isPayee ? (
              <Icon color="3D9970" name="checkmark" />
            ) : (
              ""
            )}
          </Text>
        </View>
      </Content>
    </ListItem>
    // <View><Text>hi</Text></View>
  );
}
