// Author: Masood
// Assignment 2
// Course 3322

var createError = require("http-errors");
var express = require("express");    // Returns the express module
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");



const bodyParser = require("body-parser");



// Monk is a layer that helps in using mongodb database
var monk = require("monk");
// The following line is used to get the database instance 
// Which is running on the localhost at port 27017 and the database name is assignment 2
// var db = monk("127.0.0.1:27017/assignment2");
var db = monk("127.0.0.1:27017/test");


// load the router module
var productsRouter = require("./routes/products.js");

// Setting up the app for use
var app = express();   // Instantiates express and assigns it to app

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Creating options for cors
var corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true,
};


app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());    // To use cookies technology and json technology

// A middleware to serve the static file from the public diretcory
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use("/", productsRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Assignment 2 server listening at http://%s:%s", host, port);
});
