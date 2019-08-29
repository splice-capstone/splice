import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  findUser,
  addUserToReceipt,
  findOrCreateUser,
  getMyFriends,
} from '../src/tools/firebase';
import db from '../src/tools/firebase';
import { useStateValue } from '../state';
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
  const [{ currentUser }, dispatch] = useStateValue();
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [usersToAdd, setUserOptions] = useState([]);
  const [friendsArr, setFriends] = useState([]);

  const receipt = props.navigation.getParam('receipt');

  //push notification stuff
  const MESSAGE_ENPOINT = 'http://a242df62.ngrok.io/message';

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

  //get all friends
  useEffect(() => {
    getMyFriends(currentUser.email).then(friend => {
      setFriends(friend);
    });
  }, [currentUser.email]);

  const getUsers = search => {
    //called when pressing search
    setSearching(true);
    findUser(search).then(users => {
      //if user doesn't exist yet, prompt to add to database
      if (!users.length) {
        //display create user option
        setAdding(true);
      }
      //if user is not currently on the receipt, add to local state user options
      else if (receipt.payees[users[0].email] !== false) {
        setUserOptions(users);
      } else {
        setUserOptions([]);
        Alert.alert('Already on receipt');
      }
    });
    setSearching(false);
  };

  const createUser = async () => {
    setSearching(false);
    setAdding(false);

    let user = {
      email: search,
      name: search.replace(/@[^@]+$/, ''),
      photoUrl:
        'https://i.pinimg.com/originals/17/63/f6/1763f6db9854dc06fdb7b65efb858cec.jpg',
    };
    await findOrCreateUser(user);
    await handleAddingUserToReceipt(receipt, user);
  };

  const handleAddingUserToReceipt = async (receipt, user) => {
    setSearching(false);
    //stop displaying user options
    setUserOptions([]);

    //get expo token for sending message
    const token = await addUserToReceipt(receipt, user.email);

    if (token) {
      const message = `Don't forget to split the bill for ${receipt.restaurant}!`;
      await sendMessage(message, token);
    }
  };

  return (
    <Container>
      <Content>
        <Header searchBar rounded style={styles.standard}>
          <Item style={styles.standard}>
            <Icon
              name="ios-search"
              onPress={() => {
                getUsers(search);
              }}
            />
            <TextInput
              placeholder="Search for friend by email"
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
        {!usersToAdd.length && adding ? (
          <ListItem>
            <Left>
              <Text>Invite user</Text>
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
                    <Icon
                      name="add"
                      style={{ color: '#3D9970' }}
                      onPress={() => {
                        handleAddingUserToReceipt(receipt, user);
                      }}
                    />
                  </Right>
                </ListItem>
              </List>
            );
          })
        )}
        <View style={styles.costInfo}>
          <Text style={styles.costText}>My Friends</Text>
        </View>
        {friendsArr &&
          friendsArr.map(user => (
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
                  <Icon
                    name="add"
                    style={{ color: '#3D9970' }}
                    onPress={() => {
                      handleAddingUserToReceipt(receipt, user);
                    }}
                  />
                </Right>
              </ListItem>
            </List>
          ))}
        <View style={styles.costInfo}>
          <Text style={styles.costText}>Current Friends on Receipt</Text>
        </View>
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
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  receiptInfo: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 2,
    color: 'black',
  },
  costText: {
    fontSize: 15,
    color: 'white',
  },
  costInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#3D9970',
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 6,
    height: 33,
    marginTop: 10,
  },
  standard: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    fontSize: 18,
    marginLeft: 10,
  },
});
