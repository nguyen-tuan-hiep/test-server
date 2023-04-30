import pool from '../models/config.js';

async function getAllCustomers(req, res) {
  try {
    const allCustomers = await pool.query('SELECT * FROM customers ORDER BY customer_id ASC');
    res.json(allCustomers.rows);
  } catch (error) {
    console.log(error.message);
  }
}

async function createCustomer(req, res) {
  try {
    const { name, gender, phone, address, point, memType } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const customer = await pool.query(
      'INSERT INTO customers (name, gender, phone, address, point, mem_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, gender, phone, address, point, memType],
    );
    res.json({ message: 'Customer was created!', customer: customer.rows[0] });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const customer = await pool.query(
      'UPDATE customers SET name = $1 WHERE customer_id = $2 RETURNING *',
      [name, id],
    );
    if (!customer.rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer was updated!', customer: customer.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function getOneCustomer(req, res) {
  try {
    const { id } = req.params;
    const customer = await pool.query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [id],
    );
    if (!customer.rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    // Check if customer exists
    const customer = await pool.query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [id],
    );
    if (!customer.rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Delete customer if it exists (ON DELETE CASCADE will delete all orders associated with the customer)
    await pool.query('DELETE FROM customers WHERE customer_id = $1', [id]);
    res.json({ message: 'Customer was deleted!' });
  } catch (error) {
    console.log(error.message);
  }
}

async function searchCustomerByName(req, res) {
  try {
    const { name } = req.body;
    const customers = await pool.query(
      'SELECT * FROM customers WHERE name LIKE $1 ORDER BY customer_id ASC',
      [`%${name}%`],
    );
    // console.log(customers.rows);
    if (!customers.rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.json(customers.rows);
  } catch (error) {
    console.log(error.message);
  }
}

export default {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  getOneCustomer,
  deleteCustomer,
  searchCustomerByName,
};
