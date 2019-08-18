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

const LoggedInScreen = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome {props.user.name}</Text>
      <Image style={styles.image} source={{ uri: props.user.photoUrl }} />

      <View style={styles.bottom}>
        <Button title="TAKE A SNAPSHOT" style={styles.buttonDark}>
          TAKE A SNAPSHOT
        </Button>
        <Button title="BY HAND" style={styles.buttonLight} color="#3D9970">
          BY HAND
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
  },
  image: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonDark: {
    backgroundColor: '#3D9970',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c4f5df',
  },
  buttonLight: {
    backgroundColor: '#c4f5df',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c4f5df',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});

export default LoggedInScreen;
