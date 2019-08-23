import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Container, Header, Content, Button, Text } from 'native-base';

const LoggedInScreen = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome {props.user.name}</Text>
      <Image style={styles.image} source={{ uri: props.user.photoUrl }} />
      <View style={styles.bottom}>
        <Button
          title="TAKE A SNAPSHOT"
          rounded
          style={styles.buttonDark}
          onPress={() => props.navigation.navigate('AddReceipt')}
        >
          <Text
            style={{
              color: 'white',
              alignContent: 'center',
              textAlign: 'center',
            }}
          >
            TAKE A SNAPSHOT
          </Text>
        </Button>
        <Button
          rounded
          style={styles.buttonLight}
          onPress={() => props.navigation.navigate('AddReceipt')}
        >
          <Text
            style={{
              color: 'black',
              alignContent: 'center',
              textAlign: 'center',
            }}
          >
            BY HAND
          </Text>
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
    width: 300,
    borderWidth: 1,
    borderColor: '#c4f5df',
    margin: 2,
  },
  buttonLight: {
    backgroundColor: '#c4f5df',
    borderRadius: 5,
    width: 300,
    borderWidth: 1,
    borderColor: '#c4f5df',
    color: '#050d09',
    margin: 2,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});

export default LoggedInScreen;
