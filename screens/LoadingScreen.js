import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Animated } from 'react-native';

export default function LoadingScreen(props) {
  const [value] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(value, {
      toValue: 0,
      duration: 3000,
    }).start();
  });

  return (
    <Animated.View style={{ ...styles.splash, opacity: value }}>
      <Image
        source={require('../assets/images/splash.gif')}
        onLoad={props._cacheResourcesAsync}
        style={styles.image}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
