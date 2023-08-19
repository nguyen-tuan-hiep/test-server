import pool from '../models/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'test';
  return jwt.sign({ _id }, JWT_SECRET, { expiresIn: '1d' });
};

async function initLogin(data) {
  const { email, password } = data;

  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  console.log(result);
  if (!result.rows[0]) {
    throw Error('Email not found');
  }

  // const match = await bcrypt.compare(password, result.password);
  const match = await bcrypt.compare(password, result.rows[0].password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return result.rows[0];
}

async function login(req, res) {
  try {
    const { email } = await initLogin(req.body);
    const token = createToken(email);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function initSignup(data) {
  const { email, password } = data;

  // Validation
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const exists = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  if (exists.length > 0) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hash],
  );
  return user;
}

async function signup(req, res) {
  try {
    const { email } = await initSignup(req.body);
    const token = createToken(email);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default { login, signup };
