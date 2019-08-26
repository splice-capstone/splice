import React, { useEffect } from 'react';
import { Content, Text, ListItem, Body, View } from 'native-base';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import db, { updateItem } from '../src/tools/firebase';
import { useStateValue } from '../state';

export default function ItemCardCopy(props) {
  const [{ currentUser, currentReceipt }, dispatch] = useStateValue();

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

  return (
    <View>
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
      {loading && <Text>Collection: Loading...</Text>}
      {values && (
        <Content>
          {values.map(doc => (
            <ListItem key={doc.id} onPress={() => update(doc)}>
              <Body>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    padding: 2,
                  }}
                >
                  <Text>{doc.name}</Text>
                  <Text>${doc.amount / 100}</Text>
                </View>
              </Body>
            </ListItem>
          ))}
        </Content>
      )}
    </View>
  );
}
