import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useStateValue } from '../state';
import { Container, Header, Content, Button, Text, Title } from 'native-base';

export default function HomeScreen(props) {
  const [{ currentUser }, dispatch] = useStateValue();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/splice.png')}
            style={styles.welcomeImage}
          />
          <Text style={styles.header}>splice</Text>
          <Text style={styles.header}>Welcome, {currentUser.name}</Text>
          <Image style={styles.image} source={{ uri: currentUser.photoUrl }} />
          <View style={styles.bottom}>
            <Button
              title="TAKE A SNAPSHOT"
              success
              style={styles.margin}
              onPress={() => props.navigation.navigate('Add Receipt')}
            >
              <Title light>TAKE A SNAPSHOT</Title>
            </Button>
            <Button
              light
              style={styles.margin}
              onPress={() => props.navigation.navigate('Receipt Form')}
            >
              <Title centered>BY HAND</Title>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  headerRight: (
    <Button
      onPress={() => alert('This is a button!')}
      title="Info"
      color="#fff"
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
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
    marginLeft: -10,
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
    marginBottom: 20,
  },
});
