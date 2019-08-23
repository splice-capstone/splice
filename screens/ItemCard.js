import React from 'react';
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Form,
  Item,
  Input,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import db, { updateItem } from '../src/tools/firebase';
import { useStateValue } from '../state';

export default function ItemCard(props) {
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

  update = doc => {
    updateItem(props.receiptId, doc, currentUser, props.receiptUserId);
  };

  return (
    <Container>
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
      {loading && <Text>Collection: Loading...</Text>}
      {values && (
        <Content>
          {values.map(doc => (
            <ListItem key={doc.id} onPress={() => update(doc)}>
              <Body>
                <Text>
                  {doc.name} ${doc.amount / 100}
                </Text>
              </Body>
            </ListItem>
          ))}
        </Content>
      )}
    </Container>
  );
}
