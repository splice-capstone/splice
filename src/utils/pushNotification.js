import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import db from '../tools/firebase';
import Constants from 'expo-constants';

const PUSH_ENDPOINT = `${Constants.manifest.extra.ngrok}/token`;
const MESSAGE_ENPOINT = `${Constants.manifest.extra.ngrok}/message`;

export async function registerForPushNotificationsAsync(user) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  try {
    let token = await Notifications.getExpoPushTokenAsync();
    return token;
  } catch (err) {
    console.error(err);
  }

  // POST the token to your backend server from where you can retrieve it to send push notifications.
}
