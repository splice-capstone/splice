import express from 'express';
import Expo from 'expo-server-sdk';
const app = express();
const expo = new Expo();
let savedPushTokens = [];
const PORT_NUMBER = 3000;

const saveToken = token => {
  if (savedPushTokens.indexOf(token === -1)) {
    savedPushTokens.push(token);
  }
};

const handlePushTokens = (message, pushToken) => {
  let notifications = [];
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }
  notifications.push({
    to: pushToken,
    sound: 'default',
    title: '$plice that bill',
    body: message,
    data: { message },
    ios: {
      _displayInForeground: true,
    },
  });

  let chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Push Notification Server Running');
});

app.post('/token', (req, res) => {
  saveToken(req.body.token.value);
  console.log(`Received push token, ${req.body.token.value}`);
  res.send(`Received push token, ${req.body.token.value}`);
});

app.post('/message', (req, res) => {
  handlePushTokens(req.body.message, req.body.pushToken);
  console.log(`Received message, ${req.body.message}`);
  res.send(`Received message, ${req.body.message}`);
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server Online on Port ${PORT_NUMBER}`);
});
