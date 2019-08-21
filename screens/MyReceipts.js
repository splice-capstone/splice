import React, { useState, useEffect } from "react";
import {View} from 'react-native'
import { useStateValue } from "../state";
import { getMyReceipts } from "../src/tools/firebase/index";
import MyReceiptsCard from "./MyReceiptsCard";

const MyReceipts = () => {
  const [{ currentUser }, dispatch] = useStateValue();

  let myRecps = [];

  useEffect(() => {
    console.log(currentUser);
    getMyReceipts(currentUser.email).then(data => {});
  });

  return myRecps.length > 0 ? (
    <Text>some recps</Text>
  ) : (
    <View>
      <MyReceiptsCard />
    </View>
  );
};

export default MyReceipts;
