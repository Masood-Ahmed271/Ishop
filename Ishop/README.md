---
Title:  IShop
Author: Masood Ahmed
Email: 'masood20@connect.hku.hk' or 'mangimasood2000@gmail.com'
---

# IShop

It is an app that is made on MERN stack technologies. The app depicts a simple E-commerce store that allows you to purchase things online. Feel free to play with the app and make changes.

____________________________________________________________________________________________________________________________________________________________________

## Things required to run this program

Your should have node, and mongodb installed for you to run the codes.


*Note:* You might need following node dependencies to run the app:
***
*     cookie-parser                  (npm i cookie-parser)
*     express                        (npm install express)
*     express-session                (npm install express-session)
*     monk                           (npm install --save monk)
*     morgan                         (npm i morgan)
*     xml2js                         (npm i xml2js)
*     cors                           (npm i cors)

*Note:* Also try to follow the same folder structure and if it doesn't work, try running 'npm install' first and retry the commands given below

*Note:* You should also have REACT installed in your system along with JQuery. You can use the following commands. 
```terminal/cmd
npx create-react-app shoppingapp
cd shoppingapp
npm install jquery
```
____________________________________________________________________________________________________________________________________________________________________

## Mongodb Setup

For you to be able to run the app properly by taking data from mongodb, you must need to setup mongodb and add data in it. You might need to delete the 'data' folder and re-create it 
and run it using the command 

____________________________________________________________________________________________________________________________________________________________________

## To run the Code for the NewsFeed:

You would have to open four terminals. In two terminals run the mongodb and mongo server by looking at the commands below. In the terminal where you ran the command mongo (in mac {do accordingly in windows})
run the following commands:

```terminal/cmd
db.productCollection.insert({name: 'iPhone 13', 'category':'Phones', 'price': 8000, Manufacturer:'Apple Inc.', 'productImage':'images/iPhone13.jpg', 'description':'Most advanced dual camera system ever.'})
```

This will create a collection in mongodb called userList. You can create multiple such users (refer to databaseInsertFile.txt)

The following command is used to create a mongodb collection called newsList. Again, you can multiple but do remember to change the objectID because it might be unqiue and different for different users.
```terminal/cmd
db.userCollection.insert({'username': 'Arif', 'password': 'Jamali', 'cart':[{'productId': ObjectId("62b91f21148f63b82cb93c61"), 'quantity': 2}, {'productId': ObjectId("62b91f31148f63b82cb93c68"), 'quantity': 3}], 'totalnum': 5})
```

*Note:* You can have an example of database data from databaseInsertFile.txt.


*Commands For MacOS!!*

Terminal 1 to run mongo server:

```terminal/cmd
mongod --dbpath YourPath/test/data
```

Terminal 2 to open mongo and add data:

```terminal/cmd
mongo
```

*Commands For Windows!!*

Terminal 1 to run mongo server:

```terminal/cmd
./bin/mongod --dbpath YourPath/test/data
```

Terminal 2 open mongo and add data:

```terminal/cmd
./bin/mongo
```

____________________________________________________________________________________________________________________________________________________________________


#### To Run the backend server.

Terminal 3:

```terminal/cmd
node app.js
```


____________________________________________________________________________________________________________________________________________________________________


#### To Finally Run the Frontend.

Terminal 4:

```terminal/cmd
npm start
```

## You can view your app on the browser on the following url:

http://127.0.0.1:3000/ 

or by

http://localhost:3000/


____________________________________________________________________________________________________________________________________________________________________

## For Reference if needed:

To create an express app you can run the following command by going into your desired directory.

```terminal/cmd
cd test
npx express-generator
```