import React from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { useStateValue } from '../state';
import { Title, Text, Thumbnail } from 'native-base';

export default function AccountScreen() {
  const [{ currentUser }, dispatch] = useStateValue();

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Image
          source={require('../assets/images/splice.png')}
          style={styles.welcomeImage}
        />
        <Text style={styles.header}>splice</Text>
        <View style={styles.contentContainer}>
          <Text>{currentUser.name}</Text>
          <Text>{currentUser.email}</Text>
          <View style={styles.contentContainer}>
            <Thumbnail large source={{ uri: currentUser.photoUrl }} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  header: {
    marginTop: 10,
    fontSize: 18,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
    marginBottom: 20,
  },
});
