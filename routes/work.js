const express = require('express');
const workController = require('../controller/work');
const User = require('../model/user');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/addTask',isAuth, workController.getAddTask)

router.post('/addTask',isAuth,  workController.postAddTask)

router.get('/addMeet',isAuth,  workController.getAddMeet)

router.post('/addMeet',isAuth,  workController.postAddMeet)

router.get('/todo',isAuth,  workController.getToDo)

router.post('/delete',isAuth,  workController.postDelete)

router.post('/deleteMeet',isAuth,  workController.postDeleteMeet)

router.get('/done',isAuth,  workController.getDone)

module.exports = router;
