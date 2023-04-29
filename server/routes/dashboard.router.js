const router = require('express').Router();
const authorization = require('../middleware/authorization');
const pool = require('../models/config');

router.get('/', authorization, async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      req.user.id,
    ]);
    res.json(user.rows[0]);
    // res.json(req.user); // return user_id
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Unexpected error occurred' });
  }
});

module.exports = router;
