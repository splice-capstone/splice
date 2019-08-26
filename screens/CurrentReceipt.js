/* eslint-disable quotes */
/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useStateValue } from "../state";
import ItemCard from "./ItemCard";
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  View
} from "native-base";

import {
  useDocumentData,
  useCollectionData,
  useCollection
} from "react-firebase-hooks/firestore";
import db, {
  calculateSubtotal,
  toggleReceiptUser
} from "../src/tools/firebase";

export default function CurrentReceipt(props) {
  const [{ currentUser }, dispatch] = useStateValue();
  const [comments, setComments] = useState("");
  const [userSubtotal, setSubtotal] = useState(0);
  const [userTax, setTax] = useState(0);
  const [userTip, setTip] = useState(0);
  const [userTotal, setTotal] = useState(0);
  const [receiptItems, setItems] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [myPrices, setMyPrices] = useState({});

  const receiptId = props.navigation.getParam(
    "receiptId",
    "1Y8k9OAQhJAlctRTAjYW"
  );

  let [receiptValue, receiptLoading, receiptError] = useDocumentData(
    db.collection("receipts").doc(receiptId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: "id"
    }
  );

  let [userValues, userLoading, userError] = useCollectionData(
    db
      .collection("receipts")
      .doc(receiptId)
      .collection("receipt_users")
      .where("email", "==", currentUser.email),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: "id"
    }
  );

  const tapItem = async (userId, itemId, payees, amount) => {
    try {
      const hehe = await toggleReceiptUser(
        userId,
        itemId,
        receiptId,
        payees,
        amount
      );
    } catch (err) {
      console.error(err);
    }
  };

  const calcSubtotal = () => {
    let subtotal = 0;
    receiptItems.forEach(item => {
      if (item.payees[currentUser.email].isPayee) {
        subtotal += item.costPerUser;
      }
    });
    return subtotal;
  };

  useEffect(() => {
    const unsub = db
      .collection("receipts")
      .doc(receiptId)
      .collection("items")
      .onSnapshot(snap => {
        const itemArr = [];
        snap.forEach(itemDoc => {
          const { name, amount, payees, costPerUser } = itemDoc.data();
          itemArr.push({
            name,
            key: itemDoc.id,
            amount,
            payees,
            costPerUser
          });
        });
        setLoadingState(false);
        setItems(itemArr);
      });

    const newComments = props.navigation.getParam("comments", "");
    if (newComments) {
      setComments(newComments);
    }
    if (userValues && receiptValue && userValues[0].id) {
      //recalculate my user subtotals based on sum of my items map
      calculateSubtotal(receiptId, userValues[0].id).then(subtotal =>
        setSubtotal(subtotal / 100)
      );
      //calculate user tax based on user subtotal/overall total * overall tax
      setTax(
        Math.floor(
          ((userSubtotal / receiptValue.total) * receiptValue.tax) / 100
        )
      );
      //calculate user tip based on user subtotal/overall total * overall tip
      setTip(
        Math.floor(
          ((userSubtotal / receiptValue.total) * receiptValue.tip) / 100
        )
      );
      //calculate user total based on user subtotal + user tax + user tip
      setTotal(Math.floor(userSubtotal + userTax + userTip));
    }
    return () => unsub();
  }, [receiptId]);

  // listen on receipt_users doc that emails current user email

  return (
    <Container>
      {(receiptError || userError) && (
        <Text>Error: {JSON.stringify(receiptError)}</Text>
      )}
      {(receiptLoading || userLoading) && <Text>Collection: Loading...</Text>}
      {receiptValue && userValues && (
        <Content>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-evenly"
            }}
          >
            <Button>
              <Text
                onPress={() =>
                  props.navigation.navigate("Receipt Form", {
                    current: receiptValue,
                    navigation: props.navigation,
                    userId: userValues[0].id,
                    email: currentUser.email
                  })
                }
              >
                Edit
              </Text>
            </Button>
            <Text
              style={{
                fontWeight: "600",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {receiptValue.restaurant}
            </Text>
            <Button>
              <Icon
                name="md-person-add"
                onPress={() =>
                  props.navigation.navigate("Add User", {
                    receipt: receiptValue
                  })
                }
              />
            </Button>
          </View>

          <Text>{comments.restaurant}</Text>
          <Text>{comments.misc}</Text>
          <Text>{comments.date}</Text>
          <Text>Id: {receiptValue.id}</Text>
          <Text>Date: {receiptValue.date}</Text>
          <Text>Owner: {receiptValue.owner}</Text>
          <Text>Subtotal: ${receiptValue.subtotal / 100}</Text>
          <Text>Tax: ${receiptValue.tax / 100}</Text>
          <Text>Total: ${receiptValue.total / 100}</Text>
          <Text>My Subtotal: ${calcSubtotal() / 100}</Text>
          <Text>My Tax: ${userTax}</Text>
          <Text>My Tip: ${userTip}</Text>
          <Text>My Total: ${userTotal}</Text>
          {!loadingState ? null : <Text>still loading..</Text>}

          {!loadingState && (
            // receiptItems.map(itemInfo => {
            //   return (
            //     <ItemCard
            //       itemInfo={itemInfo}
            //       receiptUserId={userValues[0].id}
            //       key={itemInfo.key}
            //     />
            //   );
            // })}
            <FlatList
              data={receiptItems}
              renderItem={itemInfo => (
                <ItemCard
                  itemInfo={itemInfo}
                  receiptUser={currentUser}
                  key={itemInfo.key}
                  presser={tapItem}
                />
              )}
            />
          )}
        </Content>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30
  },
  header: {
    marginTop: 10,
    fontSize: 18
  }
});
