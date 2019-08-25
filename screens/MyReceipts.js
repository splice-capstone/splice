import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Container, Content } from "native-base";
import { useStateValue } from "../state";
import { getMyReceipts } from "../src/tools/firebase/index";
import MyReceiptsCard from "./MyReceiptsCard";

const MyReceipts = (props) => {
  const [{ currentUser }, dispatch] = useStateValue();
  const [myRecps, setMyReceipts] = useState([]);

  useEffect(() => {
    console.log('using effect - current user: ', currentUser)
    getMyReceipts(currentUser.email).then(data => {
      console.log(data)
      setMyReceipts(data);
      console.log(myRecps)
    });
  }, []);

  return (myRecps.length > 0 && Array.isArray(myRecps))  ? (
    <Container>
      <Content>
        {myRecps.map(recData => {
          return <MyReceiptsCard key={recData.id} recptsData={recData} navigation={props.navigation}/>;
        })}
      </Content>
    </Container>
  ) :
  null;
};

export default MyReceipts;
