import React, { Component } from 'react';
import { View, WebView, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';

export default class Paypal extends Component {
  state = {
    accessToken: null,
    approvalUrl: null,
    paymentId: null,
  };
  async componentDidMount() {
    let currency = '100 USD';
    currency.replace(' USD', '');

    const dataDetail = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            total: currency,
            currency: 'THB',
            details: {
              subtotal: currency,
              tax: '0',
              shipping: '0',
              handling_fee: '0',
              shipping_discount: '0',
              insurance: '0',
            },
          },
        },
      ],
      redirect_urls: {
        return_url:
          'http://127.0.0.1:19001/node_modules/expo/AppEntry.bundle?platform=ios&dev=true&minify=false&hot=false',
        cancel_url: 'https://example.com',
      },
    };
    const PAYPAL_CLIENT = Constants.manifest.extra.payPalClient;
    const PAYPAL_SECRET = Constants.manifest.extra.payPalSecret;
    const PAYPAL_OAUTH_API = 'https://api.sandbox.paypal.com/v1/oauth2/token/';
    const PAYPAL_ORDER_API =
      'https://api.sandbox.paypal.com/v2/checkout/orders/';

    console.log('sending to oauth....');

    let response1 = await fetch(PAYPAL_OAUTH_API, {
      headers: {
        Authorization:
          'Basic QWNCRGcxTml0ZVpybjZpMVNnWkVVZXpOVGVuWnVuYTZ3OC1lX1FNTlNBS0JObGo4LXU3Vi1WaDFmM25ZMFduS1QxZzBLT1ZCNnVtaXZzXzc6RUZURi01SC1sT1o5MWxUa3IzbDZRTkRmaHgzY19SVlFvSWpJay1XU3R3Y0VQLTdJbzVBWVFzaFJGMnE1SE5oeFhaOER2ZTJLWmRoc3ZVZEM',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      data: `grant_type=authorization_code`,
    });

    console.log('after oauth request********', response1);
    const data = await response1.json();
    console.log('data*************', data);
    console.log('acces token', data.access_token);
    this.setState({
      accessToken: data.access_token,
    });

    // const response = await fetch(
    //   'https://api.sandbox.paypal.com/v1/payments/payment',
    //   dataDetail,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer A21AAED2MsVp2eunmL7XHdZXwKitcaXRC4_M4NwzkqTvOZaEvSEVysuEcLHnuO6-d6mQ9GOQmcfEkPRqMcblnohRSjYETu5Gg`,
    //     },
    //   }
    // );

    // console.log('response!', response);
    // const { id, links } = response.data;
    // const approvalUrl = links.find(data => data.rel == 'approval_url');
    // this.setState({
    //   paymentId: id,
    //   approvalUrl: approvalUrl.href,
    // });
  }

  _onNavigationStateChange = webViewState => {
    if (webViewState.url.includes('https://example.com/')) {
      this.setState({
        approvalUrl: null,
      });
      const { PayerID, paymentId } = webViewState.url;
      fetch(
        `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        { payer_id: PayerID },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.accessToken}`,
          },
        }
      )
        .then(response => {
          console.log('RESPONSE', response);
        })
        .catch(err => {
          console.log({ ...err });
        });
    }
  };
  render() {
    const { approvalUrl } = this.state;
    console.log('Approval', approvalUrl);
    return (
      <View style={{ flex: 1 }}>
        {approvalUrl ? (
          <WebView
            style={{ height: 400, width: 300 }}
            source={{ uri: approvalUrl }}
            onNavigationStateChange={this._onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            style={{ marginTop: 20 }}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
}
