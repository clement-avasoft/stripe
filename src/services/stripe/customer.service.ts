import axios from 'axios';

const SECRET_KEY =
  'sk_test_51MH5jwFRS4M4CePp8Ctc34zD5gwlMxS1taAtXhcrLKSzm4aT2hV5Usw249RbQ8yZNhcVqUH3bYZQJg2uKLMfQdnj00m5xuF5DU';

const createCustomer = async (name: string) => {
  try {
    let customer = await axios.post(
      `https://api.stripe.com/v1/customers?name=${name}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded+json',
          Accept: 'application/json',
        },
      },
    );
    return customer.data;
  } catch (error) {
    return error;
  }
};

const createEphemeralKey = async (customerId: string) => {
  try {
    let ephemeralKey: any = await axios.post(
      `https://api.stripe.com/v1/ephemeral_keys?customer=${customerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Stripe-Version': '2022-11-15',
        },
      },
    );
    return ephemeralKey.data;
  } catch (error) {
    return error;
  }
};

export {createCustomer, createEphemeralKey};
