const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2U1ODNmNTU4ZWY3ZjljOWM1NmI3MmUiLCJpYXQiOjE2NzU5OTA1Mjh9.A8czgY3wbTBPal4ZooQWBJ54y8irALMHZcDw19B4PSo'
    const token = req.cookies['auth_token']; //bringing the token in the frontend from the cookies
    //console.log(token);
    //const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    //console.log(user);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();

  } catch (e) {
    // req.user = 'No user'
    // next();
    res.status(401).send({ error: 'Please authenticate.' });
  }
}

module.exports = auth;