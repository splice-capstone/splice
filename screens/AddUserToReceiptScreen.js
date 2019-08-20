import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { findUser, addUserToReceipt } from '../src/tools/firebase';
import { useStateValue } from '../state';

export default function AddUserToReceiptScreen() {
  const [search, setSearch] = useState('');
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();

  const setUser = (user, receipts) => {
    dispatch({ type: 'SET_USER', user, receipts });
  };

  return (
    <View style={styles.container}>
      {console.log('current receipt', currentReceipt)}
      <Text>add user to receipt</Text>
      <TextInput
        style={{ height: 40 }}
        placeholder="search for user by email"
        onChangeText={search => setSearch(search)}
        value={search}
      />
      <Button
        title="Search"
        onPress={() => {
          findUser(search);
        }}
      >
        Search
      </Button>
      <Button
        title="Add"
        onPress={() => {
          addUserToReceipt();
        }}
      >
        Add
      </Button>
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
