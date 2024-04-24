// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const genderRoutes = require('./routes/genderRoutes');
const menRoutes = require('./routes/menRoutes'); // Assuming you have menRoutes.js for men's diet plans
const womenRoutes = require('./routes/womenRoutes'); // Assuming you have womenRoutes.js for women's diet plans

const dbConfig = require('./config/database');
require("dotenv").config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3000;


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB using Mongoose
mongoose.connect( process.env.URL)
  .then(() => {
    console.log("Connected successfully to MongoDB");
    // You can start defining your Mongoose models and performing operations here
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// // Middleware to log requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// // Middleware to log errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Internal Server Error');
// });


// Routes
app.use('/auth', authRoutes);

app.use('/Gen', genderRoutes);

app.use('/men', menRoutes); // Endpoint for men's diet plans
app.use('/women', womenRoutes); // Endpoint for women's diet plans




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});