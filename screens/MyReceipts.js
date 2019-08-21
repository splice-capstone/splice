import React, { useState, useEffect } from "react";
import {View, Text} from 'react-native'
import { useStateValue } from "../state";
import { getMyReceipts } from "../src/tools/firebase/index";
import MyReceiptsCard from "./MyReceiptsCard";

const MyReceipts = () => {
  const [{ currentUser }, dispatch] = useStateValue();

  let myRecps = [];

  useEffect(() => {
    // console.log(currentUser);
    getMyReceipts(currentUser.email).then(data => {
      console.log(data)
      myRecps = data
    });
  });

  return myRecps.length > 0 ? (
    <MyReceiptsCard recptsData={myRecps}/>
  ) : (
      // <MyReceiptsCard />
      <View><Text>lol no recps</Text></View>
  );
};

export default MyReceipts;
