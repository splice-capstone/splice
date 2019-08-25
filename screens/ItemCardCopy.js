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

export default function ItemCard(props) {
  // const [{ currentUser, currentReceipt }, dispatch] = useStateValue();

  // const [values, loading, error] = useCollectionData(
  //   db
  //     .collection('receipts')
  //     .doc(props.receiptId)
  //     .collection('items'),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //     idField: 'id',
  //   }
  // );

  // const update = doc => {
  //   updateItem(props.receiptId, doc, currentUser, props.receiptUserId);
  // };

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

// import React from 'react';
// import { ListItem, CheckBox, Text, Body } from 'native-base';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   TouchableOpacity,
// } from 'react-native';

// import Swipeable from 'react-native-gesture-handler/Swipeable';

// const styles = StyleSheet.create({
//   rightAction: {
//     backgroundColor: '#dd2c00',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   actionText: {
//     color: '#fff',
//     fontWeight: '600',
//     padding: 20,
//   },
// });

// export const Separator = () => <View style={styles.separator} />;

// const rightAction = ({ progress, dragX, onPress }) => {
//   const scale = dragX.interpolate({
//     inputRange: [-100, 0],
//     outputrange: [1, 0],
//     extrapolate: 'clamp',
//   });
//   return (
//     <TouchableOpacity onPress={onPress}>
//       <View style={styles.rightAction}>
//         <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
//           Delete
//         </Animated.Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default function ItemCard({ props, onSwipeFromLeft, onRightPress }) {
//   return (
//     <Swipeable
//       renderRightAction={(progress, dragX) => (
//         <RightActions
//           progress={progress}
//           dragX={dragX}
//           onPress={onRightPress}
//         />
//       )}
//     >
//       <ListItem>
//         <CheckBox checked={true} />
//         <Body>
//           <Text>
//             {props.item.name} ${props.item.amount}
//           </Text>
//         </Body>
//       </ListItem>
//     </Swipeable>
//   );
// }
