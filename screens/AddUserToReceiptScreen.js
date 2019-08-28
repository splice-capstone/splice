import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import {
  findUser,
  addUserToReceipt,
  findOrCreateUser,
} from '../src/tools/firebase';
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

  //push notification stuff
  const MESSAGE_ENPOINT = 'http://20c8fab0.ngrok.io/message';

  const sendMessage = async (messageText, pushToken) => {
    await fetch(MESSAGE_ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageText,
        pushToken,
      }),
    });
  };
  //call sendMessage when a user is added to a receipt

  //end push notification stuff

  const receipt = props.navigation.getParam('receipt');

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

  const createUser = async () => {
    setSearching(false);
    let user = {
      email: search,
      name: search.replace(/@[^@]+$/, ''),
      photoUrl:
        'https://lh4.googleusercontent.com/-ZZkaquQy0CQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfQM27r8piZ9BfdwEI15D-B6Quxqg/photo.jpg',
    };
    await findOrCreateUser(user);
    await handleAddingUserToReceipt(receipt, user);
  };

  const handleAddingUserToReceipt = async (receipt, user) => {
    //get expo token for sending message
    const token = await addUserToReceipt(receipt, user.email);
    console.log('response from find or create**********', token);

    if (token) {
      const message = `Don't forget to split the bill for ${receipt.restaurant}!`;
      //TODO: need to also send/track receipt id somehow
      await sendMessage(message, token);
    }
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

        <Text style={styles.standard}>friends on receipt</Text>
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
            <Left>
              <Text>User does not exist yet</Text>
            </Left>
            <Right>
              <Button
                title="Adduser"
                onPress={() => {
                  createUser();
                }}
              >
                <Text>+</Text>
              </Button>
            </Right>
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
                        handleAddingUserToReceipt(receipt, user);
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
    justifyContent: 'center',
    fontSize: 18,
    marginLeft: 10,
  },
});
