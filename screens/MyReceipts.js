import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground } from "react-native";
import { Container, Content } from "native-base";
import { useStateValue } from "../state";
import { getMyReceipts } from "../src/tools/firebase/index";
import MyReceiptsCard from "./MyReceiptsCard";

const MyReceipts = props => {
  const [{ currentUser }, dispatch] = useStateValue();
  const [myRecps, setMyReceipts] = useState([]);

  useEffect(() => {
    getMyReceipts(currentUser.email).then(data => {
      setMyReceipts(data);
    });
  }, []);

  return myRecps.length > 0 && Array.isArray(myRecps) ? (
    <Container>
      <ImageBackground
        source={require("../assets/shapes/united-squares.png")}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode='repeat'
      >
        <Content style={{ marginTop: "5%", zIndex: -1 }}>
          {myRecps.map(recData => {
            return (
              <MyReceiptsCard
                key={recData.id}
                recptsData={recData}
                navigation={props.navigation}
              />
            );
          })}
        </Content>
      </ImageBackground>
    </Container>
  ) : null;
};

export default MyReceipts;
