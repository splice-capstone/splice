import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import MyReceipts from '../screens/MyReceipts';
import { DrawerActions } from 'react-navigation-drawer';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import AddUserToReceiptScreen from '../screens/AddUserToReceiptScreen';
import CurrentReceipt from '../screens/CurrentReceipt';
import { Ionicons } from '@expo/vector-icons';
import ReceiptForm from '../screens/ReceiptForm';
import AccountScreen from '../screens/AccountScreen';
<<<<<<< HEAD
import LoadScreen from '../screens/LoadScreen';

// import MainTabNavigator from './MainTabNavigator';

// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//   })
// );
=======
import LoginScreen from '../screens/LoginScreen';
>>>>>>> 1e36b0d64d9d2e61d6a6b3125f129591652d03c3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOpen: {
    marginLeft: 10,
    marginTop: 10,
  },
  menuClose: {
    marginLeft: 14,
    marginTop: 10,
  },
});

export const AuthNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    headerMode: 'none',
    navigationOptions: {
      title: 'Login',
      headerVisibile: false,
    },
  },
});

const InvisibleStack = createStackNavigator({
  'Add User': {
    screen: AddUserToReceiptScreen,
  },
  'Receipt Form': {
    screen: ReceiptForm,
  },
  'Current Receipt': {
    screen: CurrentReceipt,
  },
});

const DrawerNavigator = createDrawerNavigator(
  {
<<<<<<< HEAD
    Home: { screen: HomeScreen },
    'Add Receipt': { screen: CameraScreen },
    'My Receipts': { screen: MyReceipts },
    'Load Screen': { screen: LoadScreen },
    'Current Receipt': {
      screen: CurrentReceipt,
=======
    Home: {
      screen: HomeScreen,
>>>>>>> 1e36b0d64d9d2e61d6a6b3125f129591652d03c3
      navigationOptions: {
        title: 'Home',
      },
    },
    'Add Receipt': {
      screen: CameraScreen,
      navigationOptions: {
        title: 'Add Receipt',
      },
    },
    'My Receipts': {
      screen: MyReceipts,
      navigationOptions: {
        title: 'My Receipts',
      },
    },
    'My Account': {
      screen: AccountScreen,
      navigationOptions: {
        title: 'My Account',
      },
    },
    'Current Receipt': {
      screen: CurrentReceipt,
    },
  },
  {
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: 'rgba(46, 46, 46, .9)',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#c4f5df',
    },
    initialRouteName: 'Home',
  }
);

const AppStack = createStackNavigator({
  DrawerNavigator: {
    screen: DrawerNavigator,
    navigationOptions: ({ navigation }) => {
      const { state } = navigation;

      if (state.isDrawerOpen) {
        return {
          headerLeft: ({ titleStyle }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            >
              <Ionicons
                name="ios-close"
                style={styles.menuClose}
                size={36}
                color={titleStyle}
              />
            </TouchableOpacity>
          ),
        };
      } else {
        return {
          headerLeft: ({ titleStyle }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            >
              <Ionicons
                name="ios-menu"
                style={styles.menuOpen}
                size={32}
                color={titleStyle}
              />
            </TouchableOpacity>
          ),
        };
      }
    },
  },
});

const AppNavigator = createSwitchNavigator({
  App: AppStack,
  Invisible: InvisibleStack,
});

export default createAppContainer(AppNavigator);
