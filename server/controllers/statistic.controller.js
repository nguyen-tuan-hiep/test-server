import pool from '../models/config.js';

async function getOrderBetweenDate(req, res){
    try{
        const { start_date, end_date } = req.body;
        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start date and end date are required' });
          }
          if (start_date > end_date) {
            return res.status(400).json({ message: 'Start date must be before end date' });
          }
        const order = await pool.query(
      'SELECT * FROM orders WHERE order_date BETWEEN $1 AND $2',
      [start_date, end_date],
    );
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json({message: 'Order found!', data: order.rows});
    } catch (error){
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function getTop5DishesBetweenDate(req, res) {
    try {
      const { start_date, end_date } = req.body;
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      if (start_date > end_date) {
        return res.status(400).json({ message: 'Start date must be before end date' });
      }
      const dishes = await pool.query(
        'SELECT dish_id, COUNT(*) as dish_count FROM order_dishes od JOIN orders o ON od.order_id = o.order_id WHERE o.order_date BETWEEN $1 AND $2 GROUP BY dish_id ORDER BY dish_count DESC LIMIT 5;',
        [start_date, end_date],
      );
      if (!dishes.rows.length) {
        return res.status(500).json({ message: 'Dish not found' });
      }
      return res.json({ message: 'success', data: dishes.rows });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: 'Unexpected error occurred' });
    }
  }

export default {
    getOrderBetweenDate,
    getTop5DishesBetweenDate
};