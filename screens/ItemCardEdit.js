import React, { useEffect } from 'react';
import { Content, Text, ListItem, Body, View } from 'native-base';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import db, { updateItem, removeReceiptItem } from '../src/tools/firebase';
import { useStateValue } from '../state';
import { StyleSheet, Button } from 'react-native';
import Swipeout from 'react-native-swipeout';

export default function ItemCardCopy(props) {
  const [{ currentUser }, dispatch] = useStateValue();

  const [values, loading, error] = useCollectionData(
    db
      .collection('receipts')
      .doc(props.receiptId)
      .collection('items'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: 'id',
    }
  );

  const update = doc => {
    updateItem(props.receiptId, doc, currentUser, props.receiptUserId);
  };

  const handleDelete = async function(itemId) {
    await removeReceiptItem(props.receiptId, itemId);
  };

  const DeleteButton = deleteProps => {
    return (
      <Button
        title="delete"
        color="white"
        onPress={() => {
          handleDelete(deleteProps.docId);
        }}
      >
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          delete
        </Text>
      </Button>
    );
  };

  return (
    <View>
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
      {loading && <Text>Collection: Loading...</Text>}
      {values && (
        <Content>
          {values.map(doc => (
            <ListItem key={doc.id}>
              <Body>
                <View style={styles.container}>
                  <Swipeout
                    right={[
                      {
                        component: <DeleteButton docId={doc.id} />,
                        backgroundColor: '#F02828',
                        height: '100%',
                      },
                    ]}
                  >
                    <View style={styles.swipeoutView}>
                      <Text style={styles.listItems}>
                        {doc.name.toUpperCase()}
                      </Text>
                      <Text style={styles.listItems}>${doc.amount / 100}</Text>
                    </View>
                  </Swipeout>
                </View>
              </Body>
            </ListItem>
          ))}
        </Content>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  listItems: {
    color: '#3A3535',
    fontWeight: '300',
    justifyContent: 'space-between',
  },
  swipeoutView: {
    height: 45,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 2,
    paddingLeft: 2,
  },
});
