import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export default (req, res, next) => {
  const jwtToken = req.header('token');
  if (!jwtToken) {
    return res.status(403).json({ message: 'Not Authorized!' });
  }
  try {
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ message: 'Not Authorized!' });
  }
};
