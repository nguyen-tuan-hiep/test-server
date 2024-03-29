import pool from '../models/config.js';

async function getOrderBetweenDate(req, res) {
  try {
    const { beginDate, endDate } = req.query;
    if (!beginDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required',
        type: 'ERROR',
      });
    }
    if (beginDate > endDate) {
      return res
        .status(400)
        .json({ message: 'Start date must be before end date', type: 'ERROR' });
    }
    const order = await pool.query(
      'SELECT * FROM orders WHERE order_date BETWEEN $1 AND $2',
      [beginDate, endDate],
    );
    if (!order.rows.length) {
      return res
        .status(404)
        .json({ message: 'Order not found', type: 'ERROR' });
    }

    return res
      .status(200)
      .json({ message: 'Order found!', orders: order.rows, type: 'SUCCESS' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getTop5DishesBetweenDate(req, res) {
  try {
    const { beginDate, endDate } = req.query;
    if (!beginDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'Start date and end date are required' });
    }
    if (beginDate > endDate) {
      return res
        .status(400)
        .json({ message: 'Start date must be before end date' });
    }
    const dishes = await pool.query(
      'SELECT od.dish_id, d.dish_name, COUNT(*) AS dish_count FROM order_dishes od JOIN orders o ON od.order_id = o.order_id JOIN dishes d ON od.dish_id = d.dish_id WHERE o.order_date BETWEEN $1 AND $2 GROUP BY od.dish_id, d.dish_name ORDER BY od.dish_id DESC;',
      [beginDate, endDate],
    );
    if (!dishes.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    return res.status(200).json({ type: 'SUCCESS', dishes: dishes.rows, type: 'SUCCESS' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getStatistic(req, res) {
  try {
    const { beginDate, endDate } = req.query;
    if (!beginDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'Start date and end date are required' });
    }
    if (beginDate >= endDate) {
      return res
        .status(400)
        .json({ message: 'Start date must be before end date' });
    }
    const dishes = await pool.query(
      'SELECT order_date AS date, SUM(total_price) AS earned FROM orders WHERE order_date BETWEEN $1 AND $2 GROUP BY order_date ORDER BY order_date;',
      [beginDate, endDate],
    );
    if (!dishes.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    return res
      .status(200)
      .json({ message: 'success', orders: dishes.rows, type: 'SUCCESS' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}

export default {
  getOrderBetweenDate,
  getTop5DishesBetweenDate,
  getStatistic,
};
