import React, { Component } from 'react';
import { View, WebView, ActivityIndicator } from 'react-native';

export default class Paypal extends Component {
  state = {
    accessToken: null,
    approvalUrl: null,
    paymentId: null,
  };

  componentDidMount() {
    let currency = '1 USD';
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
        return_url: 'https://example.com',
        cancel_url: 'https://example.com',
      },
    };
    console.log('we are here');
    fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic QWZScVJLZTl4Z0hWamI2UEJkSlc4STdXU0tQVzdqWkFNMU5aOXNtNWlkQ1IwS2lOMmZtQ3ozbVdDRkdRMnlpZV9BM0VoVzBVTlBudklNdnA6RUthd3BNOHFSdlNkeTJPeDNpUmgweE55M01iOHlJMmhwYzZFVEFXSWZNMFF2cGVhNkdHd3lnV3IxVlViWEhSd1U3Wm5kZEp5TTRMeGtJZXE=',
      },
      body: JSON.stringify({ grant_type: 'client_credentials' }),
    })
      .then(response => {
        console.log('responseeeeeeee', response);
        this.setState({
          accessToken: response.data.access_token,
        });

        fetch(
          'https://api.sandbox.paypal.com/v1/payments/payment',
          dataDetail,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.state.accessToken}`,
            },
          }
        )
          .then(response => {
            console.log('response!', response);
            const { id, links } = response.data;
            const approvalUrl = links.find(data => data.rel == 'approval_url');
            console.log('approvalUrl', approvalUrl);

            this.setState({
              paymentId: id,
              approvalUrl: approvalUrl.href,
            });
            console.log('approvalURL1', this.state.approvalUrl);
          })
          .catch(err => {
            console.log({ ...err });
          });
      })
      .catch(err => {
        console.log({ ...err });
      });
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
    console.log('STATE', this.state);
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
