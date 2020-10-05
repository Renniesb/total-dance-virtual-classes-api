const express = require('express');

const router = express.Router();

//this route is only for logged in users

//Displays information tailored according to the logged in user
router.post('/profile', (req, res, next) => {
  //We'll just send back the user details and the token
  console.log('get profile')
  res.json({
    message : 'You made it to the secure route',
    user : req.user
  })
});

module.exports = router;