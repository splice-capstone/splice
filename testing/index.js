var _ = require('lodash');

const parseReceipt = async (response, currentUser) => {
  try {
    //send user feedback on if items were not detected
    let comments = {};

    let date = response.date.data;
    if (!date) {
      date = new Date();
      comments['date'] = 'No date detected - defaulted to today';
    }
    let restaurant = response.merchantName.data;
    if (!restaurant) {
      restaurant = '';
      comments['restaurant'] =
        'No restaurant name detected - please add manually';
    }

    //set host as one of the payees
    let payees = {};
    payees[currentUser.email] = true;

    //get base receipt level structure
    const receipt = {
      date,
      restaurant,
      subtotal: 0,
      tax: Math.ceil(response.taxAmount.data * 100),
      total: Math.ceil(response.totalAmount.data * 100),
      owner: currentUser.email,
      payees,
      open: true,
    };

    //build array of receipt line items
    const receiptItems = [];

    //these are temp variables to check for duplicate line items and that the sum of line items adds up to the subtotal
    let sum = 0;
    let duplicateTextCheck = [];

    for (let i = 0; i < response.amounts.length; i++) {
      let text = response.amounts[i].text.replace(/[^a-zA-Z\s]+/g, '').trim();
      let data = response.amounts[i].data;

      //subtotal is not detected on the overall receipt - find in items text
      if (text.toLowerCase().includes('sub')) {
        receipt.subtotal = data * 100;
      }
      //check that the item is not a repeat of the tax, tip, total and that text and data are not null. i.e. we don't need to add line items that are $0
      else if (
        !text.toLowerCase().includes('tax') &&
        !text.toLowerCase().includes('tip') &&
        !text.toLowerCase().includes('total') &&
        text &&
        data
      ) {
        //handle duplicates - if text already exists on the receiptItems, copy the first one and don't push new one again. Taggun handles duplicates such as '2 Family Style 24.0  49.90' by adding 1 item for $24 and one for $49.9
        const duplicate = _.find(
          duplicateTextCheck,
          _.matches(response.amounts[i].text)
        );
        if (duplicate) {
          const prevDup = _.find(receiptItems, _.matchesProperty('name', text));
          receiptItems.push(prevDup);
          sum += prevDup.amount;
        } else {
          //add to the duplicateTextCheck array to make sure you don't add it again later
          duplicateTextCheck.push(response.amounts[i].text);

          //add keys needed for receipt_items document in database
          receiptItems.push({
            amount: Math.ceil(data * 100),
            name: text,
            payees,
          });

          //increment the sum for the check at the end
          sum += data * 100;
        }
      }
    }

    //always need a subtotal
    if (!receipt.subtotal) {
      receipt.subtotal = receipt.total - receipt.tax;
    }

    //if receipt items don't add up to subtotal, add misc item for diff
    if (sum !== receipt.subtotal) {
      receiptItems.push({
        amount: receipt.subtotal - sum,
        name: 'Misc item',
        payees,
      });
      comments['misc'] =
        'Items did not add up to subtotal so misc item was added';
    }
    if (receipt.total - receipt.subtotal !== receipt.tax) {
      receipt.tax = receipt.total - receipt.subtotal;
      comments['tax'] = 'Auto calculated tax';
    }

    //now you have all the info to create receipt, receipt_items, and receipt_user in the database
    // try {
    //   const receiptId = await createReceipt(receipt, receiptItems, currentUser);
    //   return receiptId;
    // } catch (err) {
    //   console.log('hit an error while creating receipt');
    //   return err;
    // }
  } catch (err) {
    console.log('hit an error while parsing receipt');
    console.error(err);
    return err;
  }
};

const testReceipt = () => {
  const fs = require('fs');
  const fileRead = fs.readFileSync(__dirname + `/recp3.json`);
  const rawReceipt = JSON.parse(fileRead);
  parseReceipt(rawReceipt, {
    email: 'amandamarienelson2@gmail.com',
    name: 'Amanda Nelson',
    photoUrl:
      'https://lh3.googleusercontent.com/a-/AAuE7mDzK9pomGGFxLRgyCqf_jCXF4jhsNkQWre9W_pU8A',
  });
};

testReceipt();
