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

  const itemData = props.itemInfo.item

  console.log(itemData.costPerUser, typeof itemData.costPerUser)

  let photoArr = []

  for (let [key, value] of Object.entries(itemData.payees)) {
    if (value.isPayee) {
      photoArr.push(value.photo)
    }
  }


  return (
    <ListItem
      noIdent
      style={{ backgroundColor: "white" }}
      onPress={() =>
        props.presser(
          props.receiptUser,
          itemData.key,
          itemData.payees,
          itemData.amount
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
          <Text>{itemData.name}</Text>
          <Text>${itemData.costPerUser / 100}</Text>
          {/* <Text>
            {props.itemInfo.item.payees[props.receiptUser.email].isPayee ? (
              <Icon color="3D9970" name="checkmark" />
            ) : (
              ""
            )}
          </Text> */}
          <Right>
            {photoArr.map((photoUri, ind) => {
              return (
                <Thumbnail key={ind} small source={{uri: photoUri}} />
              )
            })}
          </Right>
        </View>
      </Content>
    </ListItem>
    // <View><Text>hi</Text></View>
  );
}
