import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStateValue } from '../state';
import {getMyReceipts} from '../src/tools/firebase/index'

const MyReceipts = () => {

  const [{ currentUser}, dispatch] = useStateValue();

  let myRecps = []

  useEffect(() => {
    console.log(currentUser)
    getMyReceipts(currentUser.email).then(data => {
      // console.log(data)
    })
  })

  return (
    myRecps.length > 0 ? <Text>some recps</Text> : <Text>no recps</Text>
  );
};

export default MyReceipts;
