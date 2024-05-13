const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
require("dotenv").config();

module.exports = {
  createStripe: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.status(201).json({ paymentIntent: paymentIntent.client_secret });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createFlouci: async (req, res) => {
    try {
      const url = "http://developers.flouci.com/api/generate_payment";
      const payload = {
        app_token: process.env.FLOUCI_PUBLISHBLE_KEY,
        app_secret: process.env.FLOUCI_SECRET_KEY,
        amount: req.body.amount,
        accept_card: "true",
        session_timeout_secs: 1200,
        success_link: "http://localhost:3000/payment/flouciSuccess",
        fail_link: "http://localhost:3000/payment/flouciFail",
        developer_tracking_id: "18705216-b00a-4cd8-b377-be118583dd5b",
      };
      const response = await axios.post(url, payload);
      res.send(response.data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  verifyFlouci: async (req, res) => {
    const payment_ID = req.params.id;
    const verificationURL = `https://developers.flouci.com/api/verify_payment/${payment_ID}`;
    try {
      const verfResult = await axios.get(verificationURL, {
        headers: {
          "Content-Type": "application/json",
          apppublic: process.env.FLOUCI_PUBLISHBLE_KEY,
          appsecret: process.env.FLOUCI_SECRET_KEY,
        },
      });
      res.send(verfResult.data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
