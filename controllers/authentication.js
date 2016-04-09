const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // sub = subject iat = issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had email and password auth'd
  // we just need to give them a token.
  // user object from passport callback
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  // See if a user with the given email exists
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }
    // If a new user, create and save
    const user = new User({
      email: email, 
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}