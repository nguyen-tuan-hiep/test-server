// create(data) (post), url = `${PREFIX}/create`
// delete(id) (delete), url = `${PREFIX}/${id}`
// update(id, data) (patch), url = `${PREFIX}/${id}`
// updateCost(id, data) (patch), url = `${PREFIX}/cost/${id}
// getOrderById(id) (get), url = `${PREFIX}/${id}`
// search(name, date) (get), url = `${PREFIX}/search`

// getStatistic(data)(get), url = `${PREFIX}/statistic`
// getOrdersBetweenDate(data) (get), url = `${PREFIX}/orderBetweenDate`

import pool from '../models/config.js';

async function createOrder(req, res) {
  try {
    const {
      phone,
      order_date,
      order_time,
      order_status,
      total_price,
      has_children,
    } = req.body;
    if (
      !phone ||
      !order_date ||
      !order_time ||
      !order_status ||
      !total_price ||
      !has_children
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const order = await pool.query(
      'INSERT INTO orders (phone, order_date, order_time, order_status, total_price, has_children) VALUES ($1, $2, $3,$4, $5, $6) RETURNING *',
      [phone, order_date, order_time, order_status, total_price, has_children],
    );
    res.json({ message: 'Order was created!', order: order.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function deleteByOrderId(req, res) {
  try {
    const { id: order_id } = req.params;
    const order = await pool.query('SELECT * FROM orders WHERE order_id = $1', [
      order_id,
    ]);
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await pool.query('DELETE FROM orders WHERE order_id = $1', [order_id]);
    res.json({ message: 'Order was deleted!', order: order.rows[0] });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateOrderById(req, res) {
  try {
    const { id } = req.params;
    let {
      customer_id,
      phone,
      order_date,
      order_time,
      order_status,
      total_price,
      has_children,
    } = req.body;

    const order1 = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1',
      [id],
    );
    if (!order1.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (
      customer_id == null &&
      phone == null &&
      order_date == null &&
      order_time == null &&
      order_status == null &&
      total_price == null &&
      has_children == null
    ) {
      return res.status(400).json({ message: 'At least 1 field is required' });
    }
    if (customer_id == null) {
      customer_id = order1.rows[0].customer_id;
    }
    if (phone == null) {
      phone = order1.rows[0].phone;
    }
    if (order_date == null) {
      order_date = order1.rows[0].order_date;
    }
    if (order_time == null) {
      order_time = order1.rows[0].order_time;
    }
    if (order_status == null) {
      order_status = order1.rows[0].order_status;
    }
    if (total_price == null) {
      total_price = order1.rows[0].total_price;
    }
    if (has_children == null) {
      has_children = order1.rows[0].has_children;
    }
    const order2 = await pool.query(
      'UPDATE orders SET customer_id = $1, phone = $2, order_date = $3, order_time = $4, order_status = $5, total_price = $6, has_children = $7 WHERE order_id = $8 RETURNING *',
      [
        customer_id,
        phone,
        order_date,
        order_time,
        order_status,
        total_price,
        has_children,
        id,
      ],
    );
    res.json({ message: 'Order was updated!', order: order2.rows[0] });
  } catch (error) {
    console.log(error.message);
  }
}
// async function updateCost

async function getOrderByOrderId(req, res) {
  try {
    const { id } = req.params;
    const order = await pool.query('SELECT * FROM orders WHERE order_id = $1', [
      id,
    ]);
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
}

async function search(req, res) {
  try {
    const { name, date } = req.body;
    const order = await pool.query(
      'SELECT * FROM orders WHERE customer_id IN (SELECT customer_id FROM customers WHERE name LIKE $1) AND order_date = $2',
      [`%${name}%`, date],
    );
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order.rows);
  } catch (error) {
    console.log(error.message);
  }
}

// getStatistic(data)(get), url = `${PREFIX}/statistic`
// async function getStatistic(req, res) {

async function getOrdersBetweenDate(req, res) {
  try {
    const { start_date, end_date } = req.body;
    const order = await pool.query(
      'SELECT * FROM orders WHERE order_date BETWEEN $1 AND $2',
      [start_date, end_date],
    );
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order.rows);
  } catch (error) {
    console.log(error.message);
  }
}

export default {
  createOrder,
  deleteByOrderId,
  getOrderByOrderId,
  search,
  updateOrderById,
  getOrdersBetweenDate,
};
