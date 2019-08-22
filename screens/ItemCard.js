import React from 'react';
import { ListItem, CheckBox, Text, Body } from 'native-base';

export default function ItemCard(props) {
  return (
    <ListItem>
      <CheckBox checked={true} />
      <Body>
        <Text>
          {props.item.name} ${props.item.amount / 100}
        </Text>
      </Body>
    </ListItem>
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
