import axios from 'axios';

const SECRET_KEY =
  'sk_test_51MH5jwFRS4M4CePp8Ctc34zD5gwlMxS1taAtXhcrLKSzm4aT2hV5Usw249RbQ8yZNhcVqUH3bYZQJg2uKLMfQdnj00m5xuF5DU';

const createPaymentMethod = async (
  type: string,
  number: string,
  year: string,
  month: string,
  cvv: string,
) => {
  try {
    let paymentMethod = await axios.post(
      `https://api.stripe.com/v1/payment_methods?type=${type}&card[number]=${number}&card[exp_year]=${year}&card[exp_month]=${month}&card[cvc]=${cvv}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded+json',
          Accept: 'application/json',
        },
      },
    );
    return paymentMethod.data;
  } catch (error) {
    return error;
  }
};

const attachPaymentMethod = async (pMethodId: string, customerId: string) => {
  try {
    let paymentMethod = await axios.post(
      `https://api.stripe.com/v1/payment_methods/${pMethodId}/attach?customer=${customerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded+json',
          Accept: 'application/json',
        },
      },
    );
    return paymentMethod.data;
  } catch (error) {
    return error;
  }
};

export {createPaymentMethod, attachPaymentMethod};
