const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function jwtGenerator(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.enc.JWT_TOKEN_EXPIRE,
  });
}

module.exports = jwtGenerator;
