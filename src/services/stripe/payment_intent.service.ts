import axios from 'axios';

const SECRET_KEY =
  'sk_test_51MH5jwFRS4M4CePp8Ctc34zD5gwlMxS1taAtXhcrLKSzm4aT2hV5Usw249RbQ8yZNhcVqUH3bYZQJg2uKLMfQdnj00m5xuF5DU';

const createPaymentIntent = async (
  amount: number,
  customerId: string,
  description: string,
) => {
  try {
    let payment_intent = await axios.post(
      `https://api.stripe.com/v1/payment_intents?amount=${amount}&currency=usd&customer=${customerId}&description=${description}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return payment_intent.data;
  } catch (error) {
    return error;
  }
};

const updatePaymentIntent = async (id: string, pMethodId: string) => {
  try {
    let payment_intent = await axios.post(
      `https://api.stripe.com/v1/payment_intents/${id}?payment_method=${pMethodId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return payment_intent.data;
  } catch (error) {
    return error;
  }
};

export {createPaymentIntent, updatePaymentIntent};
