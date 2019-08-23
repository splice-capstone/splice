import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { findUser, addUserToReceipt } from '../src/tools/firebase';
import { useStateValue } from '../state';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Text,
} from 'native-base';

export default function AddUserToReceiptScreen(props) {
  const [search, setSearch] = useState('');
  const [usersToAdd, setUserOptions] = useState([]);
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();

  const setUser = (user, receipts) => {
    dispatch({ type: 'SET_USER', user, receipts });
  };

  const getUsers = search => {
    findUser(search).then(users => {
      setUserOptions(users);
    });
  };

  return (
    <View style={styles.container}>
      <Text>Add Friend</Text>
      <TextInput
        style={{ height: 40 }}
        placeholder="search for user by email"
        onChangeText={search => setSearch(search)}
        value={search}
      />
      <Button
        title="Search"
        onPress={() => {
          getUsers(search);
        }}
      >
        <Text>Search</Text>
      </Button>
      {usersToAdd.map(user => {
        return (
          <Content key={user.email}>
            <List>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{ uri: user.photoUrl }} />
                </Left>
                <Body>
                  <Text>{user.name}</Text>
                  <Text note>{user.email}</Text>
                </Body>
                <Right>
                  <Button
                    title="Add"
                    onPress={() => {
                      addUserToReceipt(
                        props.navigation.getParam('receipt'),
                        user.email
                      );
                    }}
                  >
                    <Text>+</Text>
                  </Button>
                </Right>
              </ListItem>
            </List>
          </Content>
        );
      })}
    </View>
  );
}

//  Rendered from click on single receipt
//   see people already on it
//   invite people - search by email
//   add receipt_users subcollection doc (default to false on host field)
//   add other users to the friends item on Users doc
//   add receipt to Users doc
//   add users to every item doc to payees map (default to false)

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
