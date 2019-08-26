import React, { useState, useEffect } from 'react';
import { StyleProvider } from 'native-base';
import { StateProvider, initialState, reducer, useStateValue } from './state';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import App from './App';

export default function Root() {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <StyleProvider style={getTheme(commonColor)}>
        <App />
      </StyleProvider>
    </StateProvider>
  );
}
