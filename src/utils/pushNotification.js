import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import db from '../tools/firebase';

const PUSH_ENDPOINT = 'http://20c8fab0.ngrok.io/token';
const MESSAGE_ENPOINT = 'http://20c8fab0.ngrok.io/message';

export async function registerForPushNotificationsAsync(user) {
  console.log('running');
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  console.log('finalStatus', finalStatus);

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log('in existingststus if ', status);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    console.log('in final Status !== granted', finalStatus);
    return;
  }

  // Get the token that uniquely identifies this device
  try {
    let token = await Notifications.getExpoPushTokenAsync();

    return token;

    // fetch(PUSH_ENDPOINT, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     token: {
    //       value: token,
    //     },
    //     user: {
    //       username: user.email,
    //     },
    //   }),
    // });
  } catch (err) {
    console.error(err);
  }

  // POST the token to your backend server from where you can retrieve it to send push notifications.
}
