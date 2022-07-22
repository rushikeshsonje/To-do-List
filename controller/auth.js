const User = require('../model/user');
const bcrypt = require('bcryptjs');


exports.getLogin = ((req, res, next) => {

    let isLoggedIn = req.session.isLoggedIn
    res.render("auth/login", {
        path:'/login',
        errorMessage: '',
        // category: '',
        isAuthenticated: isLoggedIn
    })
});

exports.postLogin = ((req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let isLoggedIn = req.session.isLoggedIn
    if (email != '' && password != '') {
      User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.render('auth/login', {
          path: '/login',
          errorMessage: 'Invalid Email or Password.',
          isAuthenticated: isLoggedIn
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              console.log('user logged in succesfully');
              res.redirect('/')
            });
          } else {
          return res.render('auth/login', {
            path: '/login',
            errorMessage: 'Invalid Email or Password!.',
            // category: '',
            isAuthenticated: isLoggedIn
          });
        }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login')
    });
    } else {
      res.render('auth/login', {
        path: '/login',
        errorMessage: 'Enter Email and Password.',
        isAuthenticated: isLoggedIn
      });
    }
    
});


exports.getSignUp = ((req, res, next) => {
    let isLoggedIn = req.session.isLoggedIn
    res.render("auth/signup", {
        path:'/signup',
        errorMessage: '',
        isAuthenticated: isLoggedIn
      })
});

exports.postSignUp = ((req, res, next) => {
   let isLoggedIn = req.session.isLoggedIn
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   if (name != '' && email != '' && password != '' && confirmPassword != '') {
    if(password == confirmPassword) {
      User.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
          res.render('auth/signup', {
             path: '/signup',
             errorMessage: "Email Already Exits!!",
             isAuthenticated: isLoggedIn
          })
        } else {
          bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              name: name,
              email: email,
              password: hashedPassword,
            })
            return user.save();
          })
          .then(result => {
              res.redirect('/login');
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
     } else {
         res.render('auth/signup', {
             path: "/signup",
             errorMessage: "Password is not Matching!!",
             isAuthenticated: isLoggedIn
         })
     }
   } else {
    res.render('auth/signup', {
      path: "/signup",
      errorMessage: "Enter All Fields!",
      isAuthenticated: isLoggedIn
  })
   }
   
});


exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
      console.log(err);
      res.redirect('/')
  })
};