import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import MyReceipts from "../screens/MyReceipts";
import { DrawerActions } from 'react-navigation-drawer';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import AddUserToReceiptScreen from '../screens/AddUserToReceiptScreen';
import CurrentReceipt from '../screens/CurrentReceipt';
import { Ionicons } from '@expo/vector-icons';

// import MainTabNavigator from './MainTabNavigator';

// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//   })
// );

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

const DrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    CurrentReceipt: { screen: CurrentReceipt },
    Settings: { screen: SettingsScreen },
    AddReceipt: { screen: ReceiptScreen },
    AddUser: { screen: AddUserToReceiptScreen },
    Receipts: { screen: MyReceipts }
  },
  {
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: '#6b52ae',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
  }
);

const StackNavigator = createStackNavigator({
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

export default createAppContainer(StackNavigator);
