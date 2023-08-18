// createTable: (data) (pos), url = `${PREFIX}/create`
// updateTable: (id, data) (patch), url = `${PREFIX}/${id}`
// data is either capacity or table status
// getTableById: (id) (get), url = `${PREFIX}/${id}`
// getTableList: () (get), url = `${PREFIX}`
// deleteTableById: (id) (delete),  url = `${PREFIX}/${id}`

import pool from '../models/config.js';

async function createTable(req, res) {
  try {
    const { capacity, table_status } = req.body;
    if (
      capacity === null ||
      capacity === undefined ||
      table_status === null ||
      table_status === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const table = await pool.query(
      'INSERT INTO tables (capacity, table_status) VALUES ($1, $2) RETURNING *',
      [capacity, table_status],
    );
    return res.json({ message: 'Table was created!', data: table.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateTable(req, res) {
  try {
    const { id } = req.params;
    let { capacity, table_status } = req.body;
    console.log(req.body);

    const table1 = await pool.query(
      'SELECT * FROM tables WHERE table_id = $1',
      [id],
    );
    if (
      capacity === null ||
      table_status === null ||
      capacity === undefined ||
      table_status === undefined ||
      capacity === '' ||
      table_status === '' ||
      capacity === 0
    ) {
      return res.status(400).json({ message: 'These fields are required!' });
    }
    // if (capacity == null) {
    //     capacity =  table1.rows[0].capacity;};
    // if (table_status == null) {
    //     table_status = table1.rows[0].table_status;};
    const table2 = await pool.query(
      'UPDATE tables SET capacity = $1, table_status = $2 WHERE table_id = $3 RETURNING *',
      [capacity, table_status, id],
    );
    // Check if table exists
    if (!table2.rows.length) {
      return res.status(404).json({ message: 'Table not found' });
    }
    // Update table if it exists
    return res
      .status(200)
      .json({ message: 'Table was updated!', data: table2.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: `Unexpected error occurred ${error.message}` });
  }
}

async function getTableById(req, res) {
  try {
    const { id } = req.params;
    const table = await pool.query('SELECT * FROM tables WHERE table_id = $1', [
      id,
    ]);
    // Check if table exists
    if (!table.rows.length) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Sync reservations
    await pool.query('CALL delete_old_reservations()');

    return res.json({ message: 'Table found!', data: table.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function getTableList(req, res) {
  try {
    // Sync reservations
    await pool.query('CALL delete_old_reservations()');

    const tables = await pool.query('SELECT * FROM tables ORDER BY table_id');
    return res.status(200).json({ message: 'List found', data: tables.rows });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function deleteTableById(req, res) {
  try {
    const { id } = req.params;
    const table = await pool.query(
      'DELETE FROM tables WHERE table_id = $1 RETURNING *',
      [id],
    );
    // Check if table exists
    if (!table.rows.length) {
      return res.status(404).json({ message: 'Table not found' });
    }
    return res.status(200).json({ message: 'Table was deleted!', data: table.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

export default {
  createTable,
  updateTable,
  getTableById,
  getTableList,
  deleteTableById,
};
