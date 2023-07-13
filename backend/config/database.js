// Importing the 'mongoose' module
const mongoose = require("mongoose");

// Importing and configuring the 'dotenv' module to load environment variables
require("dotenv").config({ path: "backend/config/config.env" });

// Defining the function 'connectDatabase'
const connectDatabase = () => {
  // Establishing a connection to the MongoDB database
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      // Once the connection is successful, logging a message indicating the host it connected to
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

// Exporting the 'connectDatabase' function as a module
module.exports = connectDatabase;
