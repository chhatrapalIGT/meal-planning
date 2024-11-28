const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const genderRoutes = require("./routes/genderRoutes");
const menRoutes = require("./routes/menRoutes");
const womenRoutes = require("./routes/womenRoutes");
const recipeRatingRoutes = require("./routes/recipeRatingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const dbConfig = require("./config/database");
require("dotenv").config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3000;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/Gen", genderRoutes);
app.use("/men", menRoutes);
app.use("/women", womenRoutes);
app.use("/recipe", recipeRatingRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
