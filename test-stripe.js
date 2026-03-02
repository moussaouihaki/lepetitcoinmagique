const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51T0nKGJ6Z70uCAvGl1nYmgWNFD6x1ynhbH6Gkn7I0bnvFhjVcHK465tH8zZQzEUwylVq42veQd5TkqkeZZODzXSn00dLqKfIWp', { apiVersion: '2026-02-25.clover' });

stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{ price_data: { currency: 'chf', product_data: { name: 'test' }, unit_amount: 100 }, quantity: 1 }],
  mode: 'payment',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
}).then(console.log).catch(console.error);
