import React from "react";
import { View } from "react-native";
import {
  Header,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right
} from "native-base";

const MyReceiptsCard = props => {
  console.log("in my recp card", props);
  const { restaurant, date, id, total, owner } = props.recptsData;
  const {
    myDetails: { isOwner, userTotal, paid }
  } = props.recptsData;

  const totalInDollars = total / 100;
  const userTotalInDollars = userTotal / 100;
  return (
    <Card style={{ flex: 0 }} onPress>
      <CardItem>
        <Left>
          <Body>
            <Text>{restaurant}</Text>
            <Text note>{date}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem>
        <Left>
          <Body>
            {isOwner ? (
              <Text style={paid ? { color: "green" } : { color: "red" }}>{`${
                paid
                  ? `Received $${totalInDollars}`
                  : `Receiving $${totalInDollars}`
              }`}</Text>
            ) : (
              <Text style={paid ? { color: "green" } : { color: "red" }}>{`${
                paid ? "Paid" : "Need to pay"
              }: $${userTotalInDollars} to ${owner}`}</Text>
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
                    textStyle={{ color: "#87838B" }}
                    onPress={() => {
                      // placeholder to navigate to paypal
                    }}
                  >
                    <Icon type="Entypo" name="user" />
                  </Button>
                </Left>
                <Right>
                  <Button
                    transparent
                    textStyle={{ color: "#87838B" }}
                    onPress={() => {
                      props.navigation.navigate("Current Receipt", {
                        receiptId: id
                      });
                    }}
                  >
                    <Icon type="Entypo" name="arrow-bold-right" />
                  </Button>
                </Right>
              </CardItem>
            ) : (
              <CardItem>
                <Left>
                  <Button
                    transparent
                    textStyle={{ color: "#87838B" }}
                    onPress={() => {
                      // placeholder to navigate to paypal
                    }}
                  >
                    <Icon type="Entypo" name="paypal" />
                  </Button>
                </Left>
                <Right>
                  <Button
                    transparent
                    textStyle={{ color: "#87838B" }}
                    onPress={() => {
                      props.navigation.navigate("Current Receipt", {
                        receiptId: id
                      });
                    }}
                  >
                    <Icon type="Entypo" name="arrow-bold-right" />
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
