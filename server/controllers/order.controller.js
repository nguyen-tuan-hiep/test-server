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
      customer_id,
      order_date,
      order_time,
      order_status,
      total_price,
      used_point,
      dishes,
    } = req.body;
    if (!phone || !order_date || !order_time || !order_status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const order = await pool.query(
      'INSERT INTO orders (phone, customer_id, order_date, order_time, order_status, total_price, used_point) VALUES ($1, $2, $3,$4, $5, $6, $7) RETURNING *',
      [
        phone,
        customer_id || null,
        order_date,
        order_time,
        order_status,
        total_price,
        used_point || 0,
      ],
    );

    if (dishes.length > 0) {
      const values = dishes
        .map(
          (dish) => `(${order.rows[0].order_id}, ${dish.id}, ${dish.quantity})`,
        )
        .join(', ');
      console.log(values);
      const results = await pool.query(
        `INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ${values} RETURNING *;`,
      );
    }
    return res
      .status(200)
      .json({ message: 'Order was created!', data: order.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
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

    // The formula to use points is: point = previous point - used_point + 10% of final_price
    // Now rollback to previous point
    if (order.rows[0].customer_id) {
      const customer = await pool.query(
        'SELECT * FROM customers WHERE customer_id = $1',
        [order.rows[0].customer_id],
      );
      const newPoint =
        customer.rows[0].point +
        order.rows[0].used_point -
        Math.round(order.rows[0].total_price * 0.1);
      await pool.query(
        'UPDATE customers SET point = $1 WHERE customer_id = $2',
        [newPoint, order.rows[0].customer_id],
      );
    }

    await pool.query('DELETE FROM orders WHERE order_id = $1', [order_id]);

    // Delete order_dishes
    await pool.query('DELETE FROM order_dishes WHERE order_id = $1', [
      order_id,
    ]);

    return res
      .status(200)
      .json({ message: 'Order was deleted!', data: order.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateOrderById(req, res) {
  try {
    const { id } = req.params;
    const {
      phone,
      customer_id,
      order_date,
      order_time,
      order_status,
      total_price,
      used_point,
      dishes,
    } = req.body;
    console.log(req.body);
    if (!phone || !order_date || !order_time || !order_status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log([
      phone,
      customer_id || null,
      order_date,
      order_time,
      order_status,
      total_price,
      used_point || 0,
      id,
    ]);
    const order = await pool.query(
      'UPDATE orders SET phone = $1, customer_id = $2, order_date = $3, order_time = $4, order_status = $5, total_price = $6, used_point = $7 WHERE order_id = $8 RETURNING *',
      [
        phone,
        customer_id || null,
        order_date,
        order_time,
        order_status,
        total_price,
        used_point || 0,
        id,
      ],
    );

    // Delete order_dishes
    await pool.query('DELETE FROM order_dishes WHERE order_id = $1', [id]);

    if (dishes.length > 0) {
      const values = dishes
        .map(
          (dish) =>
            `(${order.rows[0].order_id}, ${dish.dish_id}, ${dish.quantity})`,
        )
        .join(', ');
      console.log(values);
      const results = await pool.query(
        `INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ${values} RETURNING *;`,
      );
    }

    return res
      .status(200)
      .json({ message: 'Order was updated!', data: order.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getOrderByOrderId(req, res) {
  try {
    const { id } = req.params;
    const order = await pool.query('SELECT * FROM orders WHERE order_id = $1', [
      id,
    ]);
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res
      .status(200)
      .json({ message: 'Order was found!', data: order.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function search(req, res) {
  try {
    const { name, phone } = req.query;
    if (!name && (phone === '' || phone === undefined || phone === null)) {
      const orders = await pool.query(
        'SELECT o.*, c.name FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id ORDER BY o.order_date DESC, o.order_time DESC',
      );
      return res.status(200).json(orders.rows);
    }

    if (!name && (phone !== '' || phone !== undefined || phone !== null)) {
      const orders = await pool.query(
        'SELECT o.*, c.name FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE o.phone LIKE $1 ORDER BY o.order_date DESC, o.order_time DESC',
        [`%${phone}%`],
      );
      return res.status(200).json(orders.rows);
    }

    // o.customer_id can be null
    const orders = await pool.query(
      // 'SELECT * FROM orders o WHERE o.customer_id IN (SELECT c.customer_id FROM customers c WHERE LOWER(c.name) LIKE LOWER($1))',
      'SELECT o.*, c.name FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE LOWER(c.name) LIKE LOWER($1) ORDER BY o.order_date DESC, o.order_time DESC',
      [`%${name}%`],
    );
    return res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getDishesByOrderId(req, res) {
  try {
    const { id } = req.params;
    const order = await pool.query(
      'SELECT * FROM order_dishes JOIN dishes ON order_dishes.dish_id = dishes.dish_id WHERE order_id = $1',
      [id],
    );
    return res.status(200).json({ message: 'Orders found!', data: order.rows });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

export default {
  createOrder,
  deleteByOrderId,
  getOrderByOrderId,
  updateOrderById,
  search,
  getDishesByOrderId,
  // getOrdersBetweenDate,
};
