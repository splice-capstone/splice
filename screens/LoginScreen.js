import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

const LoginScreen = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container} onPress={() => props.signIn()}>
        <Image source={require('../assets/images/google_signin.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  header: {
    fontSize: 25,
  },
});
