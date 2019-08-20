import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const LoginScreen = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.signIn()}>
        <Image source={require('../assets/images/google_signin.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});
