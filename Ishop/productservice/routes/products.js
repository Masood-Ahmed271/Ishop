// Assignment 2, Course 3322

var express = require("express");
var router = express.Router();



/* ====================================== backend logic ====================================== */




// **************************** A middleware that handles get request for /loadpage and reterieves _id, name, price, and productImage of the products ****************************
router.get("/loadpage", (req, res, next) => {

  var category = req.query.category;  // Haves the name of the category
  var search_string = req.query.searchstring;  // the string that needs to be searched

  //  Making a variable to store the productCollection collection
  var db = req.db;
  var productCollection = db.get("productCollection")


  // Finding the required category and the search string the product collection
  productCollection.find({category: { $regex: category },name: { $regex: search_string, $options: "i" },}).then((products) => {

    // a loop to go through each product
      products.forEach((product) => {

        delete product.category;
        delete product.description;

      });

      // for sorting the things as needed
      products.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() > a.name.toLowerCase()
          ? -1
          : 0
      );
      res.send(JSON.stringify(products));
    }) // handling errors
    .catch((err) => {
      res.send(JSON.stringify([{ err: true, err_string: err }]));      // if there is any error, we just send the error
    });
});
// **************************** A middleware that handles get request for /loadpage and reterieves _id, name, price, and productImage of the products ****************************




// **************************** A middleware that handles get request for /loadproduct and reterieves manufacturer and description of the products ****************************
router.get("/loadproduct/:productid", (req, res, next) => {

  // Getting the product ID
  var productId = req.params.productid;

  //  Making a variable to store the productCollection collection
  var db = req.db;
  var productCollection = db.get("productCollection");

  // Finding the product in the collection
  productCollection.find({_id: productId,}).then((products) => {
      var product = products[0];
      res.send(JSON.stringify(product));
    })  // error handling
    .catch((err) => {
      res.send(JSON.stringify([{ err: true, err_string: err }]));     // if there is any error, we just send the error
    });
});
// **************************** A middleware that handles get request for /loadproduct and reterieves manufacturer and description of the products ****************************





// **************************** A middleware that handles post request for /signin ****************************
router.post("/signin", (req, res, next) => {

  // Extracting username and password from the request body
  var username = req.body.username;   // username
  var password = req.body.password;   // password

  //  Making a variable to store the userCollection collection
  var db = req.db;
  var userCollection = db.get("userCollection");


  // finding username and password in database
  userCollection.find({username: username,password: password,}).then((users) => {

      // if users are not empty
      if (users.length > 0) {

        var user = users[0];
        res.cookie("userId", user._id);
        res.send(JSON.stringify({ err: false, totalnum: user.totalnum, username: user.username, _id: user._id,}));

      } 
      else {
        res.send(JSON.stringify({ err: true, err_string: "Login Failure, check your username and password",}));
      }
    })
    .catch((err) => {
      res.send(JSON.stringify([{ err: true, err_string: err }]));      // if there is any error, we just send the error
    });
});
// **************************** A middleware that handles post request for /signin ****************************




// **************** A middleware that handles get request for /signout ******************
router.post("/signout", (req, res, next) => {

  // unsetting the user cookie
  res.clearCookie("userId");
  res.send(JSON.stringify({ err: false }));
  
});
// **************** A middleware that handles get request for /signout ******************



// **************************** A middleware that handles put request for /addtocart ****************************
router.put("/addtocart", (req, res, next) => {
;
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var quantity = req.body.quantity;

  //  Making a variable to store the userCollection collection
  var db = req.db;
  var userCollection = db.get("userCollection")

  // an if condition to check the validity of the data in the variable
  if (userId !== null && typeof userId !== undefined) {
    userCollection.find({ _id: userId,}).then((users) => {
        var user = users[0];
        var added = false;
        user.cart.forEach((item) => {
          if (item.productId === productId) {
            item.quantity = parseInt(item.quantity) + parseInt(quantity);
            added = true;
          }
        });

        if (!added) {
          user.cart.push({ productId: productId, quantity: quantity });
        }
        user.totalnum = parseInt(user.totalnum) + parseInt(quantity);
        userCollection.update( { _id: userId }, { $set: { cart: user.cart, totalnum: user.totalnum } }).then(() => {
            res.send(JSON.stringify({ err: false, totalnum: user.totalnum }));
          })
          .catch((err) => {
            res.send(JSON.stringify({ err: true, err_string: err,}));
          });
      })
      .catch((err) => {
        res.send(
          JSON.stringify({ err: true, err_string: err,}));
      });
  } else {
    res.send(
      JSON.stringify({ err: true, err_string: "Unable to add to cart. Please try logging in again...",}));
  }
});
// **************************** A middleware that handles put request for /addtocart ****************************



// **************************** A middleware that handles get request for /getsessioninfo ****************************
router.get("/getsessioninfo", (req, res, next) => {

  var userId = req.cookies.userId;

  //  Making a variable to store the userCollection collection
  var db = req.db;
  var userCollection = db.get("userCollection");


 // an if condition to check the validity of the data in the variable
  if (typeof userId !== "undefined" && userId !== null) {

    userCollection.find({ _id: userId,}).then((users) => {
        if (users.length > 0) {

          var user = users[0];

          res.send(JSON.stringify({ err: false, totalnum: user.totalnum, username: user.username,_id: user._id,}));
        } else {
          res.send(JSON.stringify({err: true,err_string: "You were logged out, please sign in again.",}));
        }
      }).catch((err) => {
        res.send(JSON.stringify([{ err: true, err_string: err }]));
      });
  } else {
    res.send( JSON.stringify({ err: false, totalnum: 0, username: "",}));
  }
});
// **************************** A middleware that handles get request for /getsessioninfo ****************************


// **************************** A middleware that handles get request for /loadcart ****************************
router.get("/loadcart", (req, res, next) => {


  var userId = req.cookies.userId;   // getting the userID

  //  Making a variable to store the userCollection collection
  var db_1 = req.db;
  var userCollection = db_1.get("userCollection");

  //  Making a variable to store the productCollection collection
  var db_2 = req.db;
  var productCollection = db_2.get("productCollection");
  
  // an if condition to check the validity of the data in the variable
  if (userId !== null && typeof userId !== undefined) {

    userCollection.find({_id: userId,}).then((users) => {

        var user = users[0];
        var ids = [];

        user.cart.forEach((item) => {
          ids.push(item.productId);
        });

        productCollection.find({ _id: { $in: ids } }).then((products) => {

            if (products.length > 0) {
              for (var j = 0; j < user.cart.length; j++) {
                for (var i = 0; i < products.length; i++) {
                  if (products[i]._id.toString() === user.cart[j].productId) {
                    user.cart[j].name = products[i].name;
                    user.cart[j].price = products[i].price;
                    user.cart[j].img = products[i].productImage;
                  }
                }
              }
              user.cart.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
              );
              res.send(JSON.stringify({ err: false, cart: user.cart }));
            } else {

              res.send( JSON.stringify({ err: false, cart: [],}));
            }

          }).catch((err) => {
            res.send( JSON.stringify({ err: true, err_string: err,}));
          });
      }).catch((err) => {
        res.send( JSON.stringify({ err: true, err_string: err,}));
      });
  } else {
    res.send( JSON.stringify({ err: true, err_string: "Unable to find to cart. Please try logging in again...",}));
  }

});
// **************************** A middleware that handles get request for /loadcart ****************************



// **************************** A middleware that handles delete request for /deletefromcart ****************************
router.delete("/deletefromcart/:productid", (req, res, next) => {


  var userId = req.cookies.userId; // getting the userID
  var id = req.params.productid; // getting the productid

  //  Making a variable to store the userCollection collection
  var db = req.db;
  var userCollection = db.get("userCollection");

  // an if condition to check the validity of the data in the variable
  if (userId !== null && typeof userId !== undefined) {

    // to find the userid
    userCollection.find({_id: userId,}).then((users) => {

        var user = users[0];
        var index = 0;

        // a loop to go through the cart 
        for (var i = 0; i < user.cart.length; i++) {
          if (user.cart[i].productId.toString() === id) {
            index = i;
          }
        }

        user.totalnum =
          parseInt(user.totalnum) - parseInt(user.cart[index].quantity);

        user.cart.splice(index, 1);

        // to update the things
        userCollection.update( { _id: userId }, { $set: { cart: user.cart, totalnum: user.totalnum } }).then(() => {

            res.send(JSON.stringify({ err: false, totalnum: user.totalnum }));

          }).catch((err) => {
            res.send( JSON.stringify({ err: true, err_string: err,}));
          });
      }).catch((err) => {
        res.send( JSON.stringify({ err: true, err_string: err,}));
      });

  } else {

    res.send( JSON.stringify({ err: true, err_string: "Unable to add to cart. Please try logging in again...",}));
  }

});
// **************************** A middleware that handles delete request for /deletefromcart ****************************




// **************************** A middleware that handles put request for /updatecart ****************************
router.put("/updatecart", (req, res, next) => {


  var userId = req.cookies.userId;    // ID of the user
  var productId = req.body.productId;  // ID of the product
  var quantity = req.body.quantity;    // quantity that we have
  var oldQuantity = 0;


  //  Making a variable to store the userCollection collection
  var db = req.db;
  var userCollection = db.get("userCollection");

  // an if condition to check the validity of the data in the variable
  if (userId !== null && typeof userId !== undefined) {
    userCollection.find({_id: userId,}).then((users) => {

        var user = users[0];

        user.cart.forEach((item) => {

          if (item.productId === productId) {

            oldQuantity = item.quantity;
            item.quantity = parseInt(quantity);

          }
        });

        user.totalnum = parseInt(user.totalnum) - parseInt(oldQuantity) + parseInt(quantity);
        
        userCollection.update( { _id: userId }, { $set: { cart: user.cart, totalnum: user.totalnum } }).then(() => {
            res.send(JSON.stringify({ err: false, totalnum: user.totalnum }));
          }).catch((err) => {
            
            res.send( JSON.stringify({ err: true, err_string: err,}));

          });
      }).catch((err) => {
        
        res.send( JSON.stringify({ err: true, err_string: err,}));

      });
  } else {
    res.send( JSON.stringify({ err: true, err_string: "Unable to add to cart. Please try logging in again...",}));
  }

});
// **************************** A middleware that handles put request for /updatecart ****************************




// ********************* A middleware that handles get request for /checkout ****************************
router.get("/checkout", (req, res, next) => {

  var user = req.cookies.userId;  // getting the userID

  //  Making a variable to store the userCollection collection
  var db = req.db;
  var userCollection = db.get("userCollection");


  // updating the collection after checkout by making the totalnum 0 and cart empty
  userCollection.update({ _id: user }, { $set: { cart: [], totalnum: 0 } }).then((docs) => {

      res.send(JSON.stringify({ err: false }));

    }).catch((err) => {

      res.send(JSON.stringify({ err: true, err_string: err }));  // if there is any error, we just send the error

    });

});
// ********************* A middleware that handles get request for /checkout ****************************


// exporting 
module.exports = router;


/* ====================================== Stay Safe ====================================== */
