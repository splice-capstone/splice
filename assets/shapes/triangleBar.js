import React from "react";
import { View } from "react-native";
import Triangle from "./triangle";

const Bar = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: "row",
        marginTop: '-3%',
        paddingLeft: '1%',
        paddingBottom: '1.5%',
        overflow: 'hidden',
        width: '70%',
        zIndex: 0
      }}
    >
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
      <Triangle></Triangle>
    </View>
  );
};

export default Bar;
