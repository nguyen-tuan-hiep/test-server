import pool from '../models/config.js';

async function getAllCustomers(req, res) {
  try {
    const allCustomers = await pool.query(
      'SELECT * FROM customers ORDER BY customer_id ASC',
    );
    return res.status(200).json(allCustomers.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function createCustomer(req, res) {
  try {
    const { name, gender, phone, address, point } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }
    if (!point) {
      return res.status(400).json({ message: 'Point is required' });
    }
    // check if phone is already in use
    const customerPhone = await pool.query(
      'SELECT * FROM customers WHERE phone = $1',
      [phone],
    );
    if (customerPhone.rows.length) {
      return res
        .status(400)
        .json({ message: 'Phone is already in use', phone });
    }
    const customer = await pool.query(
      'INSERT INTO customers (name, gender, phone, address, point) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, gender, phone, address, point],
    );
    return res
      .status(200)
      .json({ message: 'Customer was created!', customer: customer.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function updateCustomer(req, res) {
  try {
    const { name, gender, phone, address, point } = req.body;
    const customerId = req.params.id;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }

    if (!point) {
      return res.status(400).json({ message: 'Point is required' });
    }

    const updatedCustomer = await pool.query(
      'UPDATE customers SET name = $1, phone = $2, point = $3, gender = $4, address = $5 WHERE customer_id = $6 RETURNING *',
      [name, phone, point, gender, address, customerId],
    );

    if (updatedCustomer.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.status(200).json({
      message: 'Customer was updated!',
      customer: updatedCustomer.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
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
    return res.status(200).json(customer.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    // check if customer exists
    const customer = await pool.query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [id],
    );
    if (!customer.rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await pool.query('DELETE FROM customers WHERE customer_id = $1', [id]);
    return res.status(200).json({ message: 'Customer was deleted!' });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function searchCustomerByName(req, res) {
  try {
    const { name } = req.body;
    const customers = await pool.query(
      `SELECT * FROM customers WHERE REPLACE(name, ' ', '') ILIKE $1
      ORDER BY CASE mem_type
      WHEN 'Bronze' THEN 1
      WHEN 'Silver' THEN 2
      WHEN 'Gold' THEN 3
      ELSE 4 `,
      [`%${name}%`],
    );
    if (!customers.rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.json(customers.rows);
  } catch (error) {
    console.log(error.message);
  }
}

async function searchCustomerByNameAndMembership(req, res) {
  try {
    const { name, rank, phone } = req.query;
    if (phone) {
      const customer = await pool.query(
        'SELECT * FROM customers WHERE phone = $1',
        [phone],
      );
      if (!customer.rows.length) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      return res.status(200).json(customer.rows[0]);
    }

    let queryText = `SELECT * FROM customers`;

    const queryParams = [];

    if (name || rank) {
      queryText += ' WHERE';

      if (name) {
        queryText += ` REPLACE(name, ' ', '') ILIKE $1`;
        queryParams.push(`%${name}%`);
      }

      if (rank) {
        if (name) {
          queryText += ' AND';
        }
        queryText += ` mem_type = $${queryParams.length + 1}`;
        queryParams.push(rank);
      }
    }

    queryText += ' ORDER BY mem_type ASC';

    const customers = await pool.query(queryText, queryParams);

    if (customers.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.status(200).json(customers.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  getOneCustomer,
  deleteCustomer,
  searchCustomerByName,
  searchCustomerByNameAndMembership,
};
