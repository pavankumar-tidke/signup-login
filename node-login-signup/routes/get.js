const db = require('./db')
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
const bcrypt = require('bcrypt')
// const bodyParser = require('body-parser')
const express = require('express');
const { promise } = require('bcrypt/promises');
const router = express.Router()



/* GET home page. */
router.get('/', (req, res, next)=>{
  try{
    db.find((er, item)=>{
      res.render('index', {
        title: 'User Details',
        userData: item 
      });
    })
  } 
  catch(e) {
    console.log(e); 
  }
  
});


router.get('/signup', (req, res)=>{
  res.render('signup', {title_signUp: 'AJAX | sign Up'})
});

router.get('/signup:username_exist', (req, res, next)=>{
  res.render('signup', {
    alert: `user exists`
  })
  next()
})

  
 
router.post('/signup', (req, res)=>{
  $('#test').html('<h1>jquery</h1>')
  try{
    let originalPass = req.body.pword;
    var username = req.body.uname;
    var check = db.findOne({username: username}, function(er, gotThatUsername) {
      if(gotThatUsername) {
        
        return res.render('signup', {
          alert: `user exists`
        })
      }
      else { 
        
        var s = bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(originalPass, salt, function(er, hash){
            let newSignUp = new db({
              email: req.body.email, 
              username: username,
              password: hash 
            })
            newSignUp.save()
              .then((result) => {
                (result) ? res.status(200).redirect('/') : res.status(404);
              }).catch((err) => {
                (err) ? res.status(400).redirect('/:signup-fail') : console.log(err);
              });
          });
        });   
      }
    })
  }
  catch(e) {
    console.log(e.message);
  }

});

// #### UPDATE #### //

router.post('/update/:id', (req, res)=>{
  try{
    // let id = req.body.id
    let getId = req.params.id;
    // console.log(id);
    let u = {
      email: req.body.uEmail,
      username: req.body.uUsername
    }
    var userUpdate = db.findByIdAndUpdate(getId, u, {new: true}, (er, doc)=>{
      if (doc) {
        return res.redirect('/') 
      }
      else {
        console.log(er+' er');
      }
    })
  }
  catch(e) {
    console.log(e.message);
  }
})

// #### DELETE #### //

router.post('/delete/:id', (req, res)=>{
  try{
    let getId = req.params.id;
    // console.log(getId);
    var del = db.findByIdAndDelete(getId, (er, doc, re)=>{
      if(er) {
        console.log(er);
        return res.send(er)
      }
      else if(doc) { 
        console.log(doc+'else if');
        return res.redirect('/')
      }
      else {
        console.log(re);
        return res.send(re)
      }
    });
  }
  catch(e) {
    console.log(e.message);
  }
  
  
});
 

//  ##### LOGIN  #### //

router.get('/login', (req, res)=>{
  res.render('login', {
    titleLogin: 'AJAX | Log In'
  });
})
 
var loginUname;
router.post('/log', (req, res)=>{
  try {
    loginUname = req.body.uname;
    let count = 0;

    var ch = db.findOne({username: loginUname}).then((result)=>{

      if(result) {
        console.log('match');

        var comp = bcrypt.compare(req.body.pword, result.password).then((result)=>{
          if(result){
            console.log("authentication successful")
            return res.redirect('/user')
          } else {
            console.log("authentication failed. Password doesn't match")
            return res.render('login', {
              alert: "Invalid Credentials"
            })
          }
        })
        .catch((err)=>console.error(err))
      }
      else {
        console.log('not match');
        return res.render('login', {
          alert: "Invalid Credentials"
        })
      }
      
    })
    .catch((err)=>{console.error(err);})
  }
  catch(e) {
    console.log(e.m);
  }
});



// #### USER ACCOUNT #### //

router.get('/user', (req, res)=>{
  console.log(loginUname);

  db.findOne({username: loginUname}).then((result)=>{
    res.render('account', {
      title: 'User | Dashboard',
      uname: loginUname,
      email: result.email
    });
  }).catch((err)=>{
    console.log(err);
  })
  
})







 
module.exports = router;
  