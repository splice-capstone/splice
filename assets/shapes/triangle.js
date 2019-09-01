import React from 'react';
import { View } from 'react-native';

const Triangle = () => ({
  render: function() {
    return (
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          // borderStyle: "none",
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderBottomWidth: 20,
          borderTopWidth: 0,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'white',
          borderTopColor: 'transparent',
          transform: [{ rotate: '62.5deg' }],
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.5,
          shadowRadius: 0,
        }}
      />
    );
  },
});

export default Triangle;
