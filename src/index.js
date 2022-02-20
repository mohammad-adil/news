const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/db");
const app = express();

const port = process.env.PORT || 3000;

/**************NECESSARY INCLUDES*********** */

//app.use(express.static(path.join(__dirname, "/uploads")));
app.use("/images", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-Callback-Type, Content-Type, Accept"
  );
  res.header("Cache-Control", "no-cache");
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

//**********IMPORTING ROUTES********* */
const errorController = require("./middleware/errorHandler");
const userSignUpRoutes = require("./modules/user/user.routes");
const newsRoutes = require("./modules/news/news.routes");
const fileUpload = require("./middleware/fileUpload");

//*****************USING THE ROUTES************************* */

//app.use("/v1/user", userSignUpRoutes);
app.use("/v1/news", newsRoutes);
app.use("/v1/upload", fileUpload);
app.use("/v1/user", userSignUpRoutes);

app.use(errorController);

//*************************************************************/

app.listen(port, () => {
  console.log("*************************************************************");
  console.log(
    `Server is up on port ${port}! Started at ${new Date().toUTCString()}`
  );
  console.log(
    `*****************************************************************`
  );
});
