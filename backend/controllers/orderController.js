// Importing required modules and files
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/*************************************************************************************************************************/
// Creating a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  // Destructuring the required data from the request body
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Creating a new order using the Order model
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  // Sending a JSON response with the created order
  res.status(201).json({
    success: true,
    order,
  });
});

/*************************************************************************************************************************/
// Getting a single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  // Finding a single order by its ID and populating the "user" field with "name" and "email" properties
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  // Checking if the order is not found
  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }
  // Sending a JSON response with the found order
  res.status(200).json({
    success: true,
    order,
  });
});

/*************************************************************************************************************************/
// Getting orders of the logged-in user
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Finding orders associated with the logged-in user
  const orders = await Order.find({ user: req.user._id });

  // Sending a JSON response with the found orders
  res.status(200).json({
    success: true,
    orders,
  });
});

/*************************************************************************************************************************/
// Getting all orders (for admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  // Finding all orders
  const orders = await Order.find();

  // Calculating the total amount of all orders
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  // Sending a JSON response with the total amount and all orders
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

/*************************************************************************************************************************/
// Updating the status of an order (for admin)
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  // Finding an order by its ID
  const order = await Order.findById(req.params.id);

  // Checking if the order is not found
  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  // Checking if the order is already delivered
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHander("You have already delivered this order", 400)
    );
  }

  // Updating the order status based on the request body
  if (req.body.status === "Shipped") {
    // Updating the stock of each order item
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  // Setting the deliveredAt field if the status is "Delivered"
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  // Saving the updated order
  await order.save({ validateBeforeSave: false });

  // Sending a JSON response indicating success
  res.status(200).json({
    success: true,
  });
});

/*************************************************************************************************************************/
// Function to update product stock
async function updateStock(id, quantity) {
  // Finding a product by its ID
  const product = await Product.findById(id);

  // Updating the product stock by reducing the quantity
  product.stock -= quantity;

  // Saving the updated product
  await product.save({ validateBeforeSave: false });
}

/*************************************************************************************************************************/
// Deleting an order (for admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  // Finding an order by its ID
  const order = await Order.findById(req.params.id);

  // Checking if the order is not found
  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  // Removing the order
  await order.remove();

  // Sending a JSON response indicating success
  res.status(200).json({
    success: true,
  });
});
/*************************************************************************************************************************/