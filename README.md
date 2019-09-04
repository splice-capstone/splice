
# Splice
A real-time multi-user bill splitting mobile app built using React Native and Cloud Firestore.
Available on Expo - https://exp.host/@amandamarienelson/splice

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

## Prerequisites

Follow instructions on [Firebase/Firestore](https://firebase.google.com/docs/firestore) to start a project and retrieve secret keys

- Make a project and make two apps, for Android and iOS.
- After creating Android project, download google-services.json and save in the root directory. 
- In Authentication, under sign-in method, enable Google and Facebook. 
- bundle ID: com.splice.splice


Follow instructions on [Taggun](https://www.taggun.io) to create an account and retrieve API key 

Follow instructions on [ngrok](https://ngrok.com/) to create an account and retrieve API key 

Follow instrcutions to retrieve API key [Facebook OAuth](https://developers.facebook.com/docs/facebook-login/web/) for OAuth purposes 

Follow instructions to retrieve API key [Google OAuth](https://developers.google.com/actions/identity/google-sign-in-oauth) for OAuth purposes 


Create app.json file to include secret keys: 


```bash
{
  "expo": {
    "name": "splice",
    "slug": "splice",
    "privacy": "public",
    "sdkVersion": "34.0.0",
    "platforms": ["ios", "android", "web"],
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/splice.png",
    "splash": {
      "image": "./assets/images/splice.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "example.expo.googlesignin"
    },
    "extra": {
      "firebaseConfig": {
        "apiKey": " ",
        "authDomain": " ",
        "databaseURL": " ",
        "projectId": " ",
        "storageBucket": " ",
        "messagingSenderId": " ",
        "appId": " "
      },
      "taggunApiKey": " ",
      "iosClientId": " ",
      "androidClientId": " ",
      "facebookApiKey": " ",
      "ngrok": " "
    }
  }
}
```


Run 

```bash
npm install
```

```bash
npm start
```

For push notifications - need three terminals 


```bash
npm run serve 
```

```bash
ngrok http 3000  
```
Copy ngrok forwarding port into app.json under extra/ngrok

Example: 

```bash
"ngrok": "http://a242df62.ngrok.io"  
```


## Authors
[Amanda Nelson](https://github.com/anelson0828)

[Tom Sinovich](https://github.com/TomSinovich) 

[Vera Krutsina](https://github.com/vkrutsina) 

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments
A thank you to Collin Miller and Manisha Balakumar for guidance with the project and process. 
