import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../models/config.js';
import validInfo from '../middleware/validInfo.js';
import jwtGenerator from '../utils/jwtGenerator.js';
import authorization from '../middleware/authorization.js';

const router = express.Router();

// authorization middleware
router.post('/register', validInfo, async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).json({ message: 'User already exists!' });
    }
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bcryptPassword],
    );
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error!');
  }
});

router.post('/login', validInfo, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential!');
    }
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password,
    );
    if (!validPassword) {
      return res.status(401).json('Invalid Credential!');
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verify', authorization, async (req, res) => {
  try {
    // res.json(true);
    res.json(req.user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Server error' });
  }
});

export default router;
