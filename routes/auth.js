const express = require('express');

const authController = require('../controller/auth');

const User = require('../model/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignUp);

router.post('/logout', authController.postLogout)

module.exports = router;
