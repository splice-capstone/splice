const sendToTaggun = async photo => {
  console.log('sending to taggun...');
  this.setState({ loading: true });
  const body = {
    image: photo.base64,
    filename: 'example.jpg',
    contentType: 'image/jpeg',
  };
  try {
    const response = await axios.post(
      'https://api.taggun.io/api/receipt/v1/verbose/encoded',
      body,
      {
        headers: {
          apikey: Constants.manifest.extra.taggunApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    let theDate = response.data.date.data;
    console.log(JSON.stringify(response.data.amounts));

    // let theIndex = theDate.indexOf('2');
    // let newDate = theDate.slice(theIndex);
    // theDate = await newDate;
    const email = this.context[0].currentUser.email;

    let payees = {};
    payees[email] = true;
    console.log('payees in receipt screen', payees);
    const receipt = {
      date: theDate,
      restaurant: response.data.merchantName.data,
      subtotal: '',
      tax: '',
      total: '',
      owner: email,
      payees,
      open: true,
    };
    const receiptItems = [];
    for (let i = 0; i < response.data.amounts.length; i++) {
      let data = response.data.amounts[i].text;

      if (data.includes('Tax') || data.includes('tax')) {
        receipt.tax = Number(response.data.amounts[i].data) * 100;
      }
      if (data[0] === 't' || 'T') {
        receipt.total = Math.ceil(Number(response.data.amounts[i].data) * 100);
      }
      if (data.includes('Sub') || data.includes('sub')) {
        receipt.subtotal = Number(response.data.amounts[i].data) * 100;
      }
      if (
        !data.includes('Tax') &&
        !data.includes('Sub') &&
        !data.includes('TOTAL')
      ) {
        let theIdx = await data.indexOf('@');
        receiptItems.push({
          amount: data.slice(data.length - 5, data.length),
          name: data.slice(2, theIdx - 1),
          payees,
        });
      }
    }
    let receiptId = await createReceipt(
      receipt,
      receiptItems,
      this.context[0].currentUser
    );
    this.setState({ loading: false, receiptId: receiptId });
    this.props.navigation.navigate('CurrentReceipt', {
      receiptId: this.state.receiptId,
    });
    return;
  } catch (error) {
    console.log('hit an error');
    console.error(error);
  }
};

export default sendToTaggun;
