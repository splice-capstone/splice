import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import { StateProvider, initialState, reducer } from './state';

export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashReady, setSplashReady] = useState(false);
  const [value] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(value, {
      toValue: 0,
      duration: 1000,
    }).start();
  });

  if (!isSplashReady) {
    return (
      <AppLoading
        startAsync={_cacheSplashResourcesAsync}
        onFinish={() => setSplashReady(true)}
        onError={handleLoadingError}
        autoHideSplash={false}
      />
    );
  }

  if (!isAppReady) {
    return (
      <Animated.View style={{ ...styles.splash, opacity: value }}>
        <Image
          source={require('./assets/images/splash.gif')}
          onLoad={() => _cacheResourcesAsync(setAppReady)}
          style={styles.image}
        />
      </Animated.View>
    );
  }
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Animated.View style={{ ...styles.container }}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </Animated.View>
    </StateProvider>
  );
}

async function _cacheSplashResourcesAsync() {
  const gif = require('./assets/images/splash.gif');
  return Asset.fromModule(gif).downloadAsync();
}

async function _cacheResourcesAsync(setAppReady) {
  SplashScreen.hide();
  await Promise.all([
    Asset.loadAsync([require('./assets/images/splice.png')]),
    Asset.loadAsync([require('./assets/images/google_signin.png')]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
  setTimeout(() => setAppReady(true), 2000);
}

function handleLoadingError(error) {
  console.warn(error);
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
