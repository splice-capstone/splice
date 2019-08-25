import React, { useEffect } from 'react';
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
  View,
} from 'native-base';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import db, { updateItem } from '../src/tools/firebase';
import { useStateValue } from '../state';

export default function ItemCard (props) {

  return (
    // <View>
    //   {error && <Text>Error: {JSON.stringify(error)}</Text>}
    //   {loading && <Text>Collection: Loading...</Text>}
    //   {values && (
    //     <Content>
    //       {values.map(doc => (
    //         <ListItem key={doc.id} onPress={() => update(doc)}>
    //           <Body>
    //             <View
    //               style={{
    //                 flex: 1,
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-evenly',
    //                 padding: 2,
    //               }}
    //             >
    //               <Text>{doc.name}</Text>
    //               <Text>${doc.amount / 100}</Text>
    //               <Text>
    //                 {doc.payees[currentUser.email] ? (
    //                   <Icon color="3D9970" name="checkmark" />
    //                 ) : (
    //                   ''
    //                 )}
    //               </Text>
    //             </View>
    //           </Body>
    //         </ListItem>
    //       ))}
    //     </Content>
    //   )}
    // </View>
    <View><Text>hi</Text></View>
  );
}

