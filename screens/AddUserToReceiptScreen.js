import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import {
  findUser,
  addUserToReceipt,
  findOrCreateUser,
} from '../src/tools/firebase';
import { useStateValue } from '../state';
import db from '../src/tools/firebase';

import { useCollectionData } from 'react-firebase-hooks/firestore';
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
  Icon,
  Title,
  Item,
} from 'native-base';

export default function AddUserToReceiptScreen(props) {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [usersToAdd, setUserOptions] = useState([]);

  const receipt = props.navigation.getParam('receipt');

  // listen on receipt_users doc that emails current user email
  const [userValues, userLoading, userError] = useCollectionData(
    db
      .collection('receipts')
      .doc(receipt.id)
      .collection('receipt_users'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: 'id',
    }
  );

  const getUsers = search => {
    setSearching(true);
    findUser(search).then(users => {
      setUserOptions(users);
    });
  };

  const createUser = () => {
    setSearching(false);
    user = {
      email: search,
      name: search.replace(/@[^@]+$/, ''),
      photoUrl:
        'https://lh4.googleusercontent.com/-ZZkaquQy0CQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfQM27r8piZ9BfdwEI15D-B6Quxqg/photo.jpg',
    };
    findOrCreateUser(user);
    addUserToReceipt(receipt, user.email);
  };

  return (
    <Container>
      <Content>
        <Title style={styles.header}>{receipt.restaurant}</Title>
        <Header searchBar rounded style={styles.standard}>
          <Item style={styles.standard}>
            <Icon
              name="ios-search"
              onPress={() => {
                getUsers(search);
              }}
            />
            <TextInput
              placeholder="Search for user by email"
              onChangeText={search => setSearch(search)}
              value={search}
            />
          </Item>
          <Button
            transparent
            onPress={() => {
              getUsers(search);
            }}
          >
            <Text>Search</Text>
          </Button>
        </Header>
        <Text style={styles.standard}>Current Users on Receipt</Text>
        {userValues &&
          userValues.map(user => (
            <List key={user.email}>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{ uri: user.photoUrl }} />
                </Left>
                <Body>
                  <Text>{user.name}</Text>
                  <Text note>{user.email}</Text>
                </Body>
              </ListItem>
            </List>
          ))}
        {!usersToAdd.length && searching ? (
          <ListItem>
            <Text>User does not exist.</Text>
            <Button
              title="Adduser"
              onPress={() => {
                createUser();
              }}
            >
              <Text>Add User</Text>
            </Button>
          </ListItem>
        ) : (
          usersToAdd.map(user => {
            return (
              <List key={user.email}>
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
                        addUserToReceipt(receipt, user.email);
                      }}
                    >
                      <Text>+</Text>
                    </Button>
                  </Right>
                </ListItem>
              </List>
            );
          })
        )}
      </Content>
    </Container>
  );
}

//  Rendered from click on single receipt
//   see people already on it
//  x invite people - search by email x
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
  standard: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
});
