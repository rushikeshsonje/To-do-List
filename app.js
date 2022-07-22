const bodyParser = require("body-parser");
const express = require('express');
const date = require(__dirname + "/helper_functions/date.js");
const mongoose = require("mongoose");
const path = require("path")
const session = require('express-session');   // for logged in user to remember him 
const multer = require('multer');  // use for uploading files just like bodyparser
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const User = require('./model/user')
const schedule = require('node-schedule');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', 'views');

const today = date.getDate();
// Use Routes
const authRoutes = require('./routes/auth');
const workRoutes = require('./routes/work');
app.use(flash());


/* ------------------------------------ Set up database ------------------------------------ */


MONGODB_URI = "mongodb://0.0.0.0:27017/todolist";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});



app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.route("/")
  .get((req, res) => {
    res.render("index", {
      path:'/',
      isAuthenticated: req.session.isLoggedIn,
      user: req.session.user
    });
  });

app.use(workRoutes);
app.use(authRoutes);



app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  // next();
});

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
  User.findOne().then(user => {
      if(!user) {
          const user = new User({
              name: "Rushi",
              email: 'rushikesh@gmail.com',
              password: 'rushi',
              work: {
                tasks: []
              },
              meeting: {
                meets: []
              },
              workDone: {
                done: []
              }
          })
          user.save();
      }
  })
  app.listen(8000);
  console.log(`Server started at 8000`);
})
.catch(err => {
  console.log(err);
});