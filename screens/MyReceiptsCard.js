import React from "react";
import { View } from "react-native";
import {
  Container,
  Header,
  Content,
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
  return (
    <Container>
      <Content>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Left>
              <Body>
                <Text>NativeBase</Text>
                <Text note>April 15, 2016</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Body>
              <Text>sexy receipt</Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent textStyle={{ color: "#87838B" }}>
                <Icon name="logo-github" />
                <Text>1,926 stars</Text>
              </Button>
            </Left>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

export default MyReceiptsCard;
