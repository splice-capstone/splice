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
  Animated,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  StyleProvider,
  Title,
} from 'native-base';
import { Ionicons, Entypo } from '@expo/vector-icons';
import AppNavigator, {
  AuthStack,
  AuthNavigator,
} from './navigation/AppNavigator';
import { StateProvider, initialState, reducer, useStateValue } from './state';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import { AsyncStorage } from 'react-native';
import { signIn } from './src/utils/auth';

// // symbol polyfills
// global.Symbol = require('core-js/es6/symbol');
// require('core-js/fn/symbol/iterator');

// // collection fn polyfills
// require('core-js/fn/map');
// require('core-js/fn/set');
// require('core-js/fn/array/find');

// global.Symbol = require('core-js/es6/symbol');
// require('core-js/fn/symbol/iterator');
// require('core-js/fn/map');
// require('core-js/fn/set');
// require('core-js/fn/array/find');

// if (Platform.OS === 'android') {
//   if (typeof Symbol === 'undefined') {
//     if (Array.prototype['@@iterator'] === undefined) {
//       Array.prototype['@@iterator'] = function() {
//         let i = 0;
//         return {
//           next: () => ({
//             done: i >= this.length,
//             value: this[i++],
//           }),
//         };
//       };
//     }
//   }
// }

export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  // const [signedIn, setSignIn] = useState(false);
  const [isSplashReady, setSplashReady] = useState(false);
  const [value] = useState(new Animated.Value(1));

  // const [{ currentUser }, dispatch] = useStateValue();

  // const setUser = user => {
  //   dispatch({ type: 'SET_USER', user });
  // };

  // const setContacts = contacts => {
  //   dispatch({ type: 'SET_CONTACTS', contacts });
  // };

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
      <LoadingScreen
        _cacheResourcesAsync={() => _cacheResourcesAsync(setAppReady)}
      />
    );
  }
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <StyleProvider style={getTheme(commonColor)}>
        <Animated.View style={{ ...styles.container }}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </Animated.View>
      </StyleProvider>
    </StateProvider>
  );
}

//   else
//   return (
//     <StateProvider initialState={initialState} reducer={reducer}>
//       <StyleProvider style={getTheme(commonColor)}>
//         <Animated.View style={{ ...styles.container }}>
//           {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
//           <HomeScreen user={currentUser} navigation={props.navigation} />
//           <AppNavigator />
//         </Animated.View>
//       </StyleProvider>
//     </StateProvider>
//   );
// }

async function _cacheSplashResourcesAsync() {
  const gif = require('./assets/images/splash.gif');
  return Asset.fromModule(gif).downloadAsync();
}

async function _cacheResourcesAsync(setAppReady) {
  try {
    SplashScreen.hide();
    await Promise.all([
      Asset.loadAsync([require('./assets/images/splice.png')]),
      Asset.loadAsync([require('./assets/images/google_signin.png')]),
      Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
        ...Entypo.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
    //check if signed in from auth function
    // const user = await signIn();
    // console.log('user', user);
    // setUser({ email: 'amandamarienelson2@gmail.com' });
    setTimeout(() => setAppReady(true), 2000);
  } catch (err) {
    console.warn(err);
  }
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
