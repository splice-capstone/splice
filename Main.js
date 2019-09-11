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
  TextInput,
  TouchableOpacity,
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
  AppNav,
} from './navigation/AppNavigator';
import { StateProvider, initialState, reducer, useStateValue } from './state';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import { AsyncStorage } from 'react-native';
import { signIn, isSignedIn } from './src/utils/auth';
import { YellowBox } from 'react-native';

//push notifications
import { Notifications } from 'expo';
import { registerForPushNotificationsAsync } from './src/utils/pushNotification';
import db from './src/tools/firebase';

export default function Main(props) {
  console.disableYellowBox = true;
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashReady, setSplashReady] = useState(false);
  const [value] = useState(new Animated.Value(1));
  const [{ currentUser }, dispatch] = useStateValue();
  const [notification, setNotification] = useState(null);
  const [expoToken, setExpoToken] = useState(null);

  const setUser = user => {
    dispatch({ type: 'SET_USER', user });
  };

  const checkForUser = async () => {
    //check if signed in from auth function
    const user = await isSignedIn();
    if (user) {
      await setUser(user[0]);

      if (expoToken) {
        // save token in firestore db for user
        const userDoc = await db.collection('users').doc(user[0].email);
        userDoc.set(
          {
            expoToken,
          },
          { merge: true }
        );
      }
    }
  };

  const handleNotification = notification => {
    setNotification(notification);
    // props.navigation.navigate('Current Receipt', {
    //   receiptId: id,
    // });
  };

  useEffect(() => {
    Animated.timing(value, {
      toValue: 0,
      duration: 1000,
    }).start();

    //push stuff

    let notificationSubscription = Notifications.addListener(
      handleNotification
    );
    registerForPushNotificationsAsync(currentUser).then(response => {
      const token = response;
      if (token) {
        setExpoToken(token);
      }
    });
    checkForUser().then();
  }, [expoToken]);

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
  if (!currentUser || !currentUser.email) {
    return (
      <Animated.View style={{ ...styles.container }}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <LoginScreen />
      </Animated.View>
    );
  }
  if (currentUser.email) {
    return (
      <Animated.View style={{ ...styles.container }}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </Animated.View>
    );
  }
}

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
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        Zocial: require('native-base/Fonts/Zocial.ttf'),
        Feather: require('native-base/Fonts/Feather.ttf'),
      }),
    ]);
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
