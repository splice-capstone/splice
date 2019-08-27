import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Swipeout from 'react-native-swipeout';

// Buttons
var swipeoutBtns = [
  {
    text: 'Button',
  },
];

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Swipeout right={swipeoutBtns}>
          <View style={styles.swipeoutView}>
            <Text>Swipe me left</Text>
          </View>
        </Swipeout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
  },
  swipeoutView: {
    height: 50,
  },
});
