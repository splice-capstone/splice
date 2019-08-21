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
    <View>
      <Container>
        <Header />
        <Content>
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Left>
                {/* <Thumbnail source={{ uri: "Image URL" }} /> */}
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                {/* <Image
                  source={{ uri: "Image URL" }}
                  style={{ height: 200, width: 200, flex: 1 }}
                /> */}
                <Text>sexy receipt</Text>
              </Body>
            </CardItem>
            <CardItem>
              {/* <Left>
                <Button transparent textStyle={{ color: "#87838B" }}>
                  <Icon name="logo-github" />
                  <Text>1,926 stars</Text>
                </Button>
              </Left> */}
            </CardItem>
          </Card>
        </Content>
      </Container>
    </View>
  );
};

export default MyReceiptsCard;
