const User = require('../model/user');
const Work = require('../model/work');
const Meet = require('../model/meet')
const workDone = require('../model/workDone');
const date = require("../helper_functions/date");
const alert = require('alert')


const today = date.getDate();

exports.getAddTask = ((req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn
    res.render("addTask", {
        path: '/addTask',
        user: req.user,
        isAuthenticated: isLoggedIn,
        user: req.session.user
        // category: ''
    });
});
exports.getAddMeet = ((req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn
    res.render("addMeet", {
        path: '/addMeet',
        user: req.session.user,
        // category: ''
        isAuthenticated: isLoggedIn

    });
});

exports.getToDo = ((req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn;
  const getUser = req.session.user;
  const gotUser = getUser._id.toString();
  var time = new Array();

  Work.find({ userId: gotUser })

  .then(tasks => {
    Meet.find({ userId: gotUser })
    .then(meets=> {
      var countTime;
      for (let i = 0; i < meets.length; i++) {
        const gotDate = meets[i].date;
        console.log(meets[i].date);
        var countDownDate = new Date(gotDate).getTime();
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            countTime = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            // If the count down is finished, write some text

            time[i] = countTime;
            console.log(time[i]); 
            if (distance < 0) {
              // clearInterval(x);
              alert('Meet Scheduled at '+ gotDate) 
                time[i] = "EXPIRED";
              }                     
            // }, 1000);
          }

          res.render('todo', {   
            path: '/todo',
            user: req.session.user, 
            meet: meets,
            task: tasks,
            countTime: time, 
            isAuthenticated: isLoggedIn
          })
        })
      })
          
    .catch(err => {
      console.log(err);
    });

 
});


exports.getDone = ((req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn;
  const getUser = req.session.user;
  const gotUser = getUser._id.toString();


  workDone.find({ userId: gotUser })
      .then(done => {
        res.render('done', {
          path: '/done',
          user: req.session.user,
          done: done,
          isAuthenticated: isLoggedIn
      })
    })
  .catch(err => {
    console.log(err);
  });
});

exports.postDelete = ((req, res, next) => {
  const checkedItemID = req.body.checkbox;
  const _id = req.body.userId;
  console.log(_id);
  Work.findById(checkedItemID, (err, item) => {
    console.log(item.taskName);
    if(!err) {
      const newItem = new workDone({
        doneTask: item.taskName,
        userId: _id,
        date: today
      })
      newItem.save((err, item) => {
      if (!err) { console.log("Successfully posted to workdone " + item.doneTask  + "!");}
      else { console.error(err);}
    })
  }
  })
  .then(result => {
    Work.findByIdAndDelete(checkedItemID, (err, item) => {
      if (!err) { console.log("Successfully deleted " + item.taskName + "!");}
    })
    console.log(result);
    res.redirect('/done');
  })
  .catch(err => {
    console.log(err);
    res.redirect('/todo')
  })
});

exports.postDeleteMeet = ((req, res, next) => {
  const checkedItemID = req.body.checkbox;
  const _id = req.body.userId;
  // console.log(_id);
  // console.log(date);
  // console.log(time);
  Meet.findById(checkedItemID, (err, item) => {
    console.log(item.meetName);
    if(!err) {
      const newItem = new workDone({
        doneTask: item.meetName,
        date: item.date,
        time: item.time,
        userId: _id
      })
      newItem.save((err, item) => {
      if (!err) { console.log("Successfully posted to workdone" + item.doneTask  + "!");}
      else { console.error(err);}
    })
  }
  })
  .then(result => {
    Meet.findByIdAndDelete(checkedItemID, (err, item) => {
      if (!err) { console.log("Successfully deleted " + item.meetName + "!");}
    })
    console.log(result);
    res.redirect('/done');
  })
  .catch(err => {
    console.log(err);
    res.redirect('/todo')
  })
});


exports.postAddTask = ((req, res, next) => {
    const addTasks = req.body.addTasks;
    const _id = req.body.userId;

    if ( addTasks != '' ) {
      const work = new Work({
        taskName: addTasks,
        userId: _id
      });
      work
        .save()
        .then(result => {
          console.log(result);
          console.log('Created Product');
          res.redirect('/todo');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/addTasks')
        });
    } else {
      res.redirect('/addTasks')
    }
  });



exports.postAddMeet = ((req, res, next) => {
  const addMeet = req.body.addMeet;
  const date = req.body.date;
  const _id = req.body.userId;

  if( addMeet != '' && date != '') {
    const meet = new Meet({
      meetName: addMeet,
      date: date,
      // time: time,
      userId: _id
    });
    meet
      .save()
      .then(result => {
        console.log(result);
        console.log('Created Product');
        res.redirect('/todo');
      })
      .catch(err => {
        console.log(err);
        res.redirect('/addMeet')

      });
  } else {
    res.redirect('/addMeet')
  }
});

