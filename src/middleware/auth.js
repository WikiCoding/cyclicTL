const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    let token = null
    if (req.cookies) {
      token = req.cookies['auth_token']; //bringing the token in the frontend from the cookies
    } else {
      token = req.header('Authorization').replace('Bearer ', '');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: '1days'
    });
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();

  } catch (e) {
    //res.status(401).send({ error: 'Please authenticate.' });
    res.redirect('/')
  }
}

module.exports = auth;
