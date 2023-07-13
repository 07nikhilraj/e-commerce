// Importing the catchAsyncErrors middleware
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Importing the 'stripe' module and initializing it with the Stripe secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Processing payment
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // Creating a payment intent using the 'stripe' module
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  // Sending a JSON response with the payment intent client secret
  res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

// Sending the Stripe API key
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  // Sending a JSON response with the Stripe API key
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
