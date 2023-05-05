// createTable: (data) (pos), url = `${PREFIX}/create`
// updateTable: (id, data) (patch), url = `${PREFIX}/${id}`
// data is either capacity or table status
// getTableById: (id) (get), url = `${PREFIX}/${id}`
// getTableList: () (get), url = `${PREFIX}`
// deleteTableById: (id) (delete),  url = `${PREFIX}/${id}`

import pool from "../models/config.js";

async function createTable(req, res) {
    try{
        const { capacity, table_status } = req.body;
        if (!capacity || !table_status) {
            res.status(400).json({ message: 'All fields are required' });
        }
        const table = await pool.query(
            'INSERT INTO tables (capacity, table_status) VALUES ($1, $2) RETURNING *',
            [capacity, table_status],
        );
        res.json({ message: 'Table was created!', table: table.rows[0] });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
}

async function updateTable(req, res) {
    try {
        const { id } = req.params;
        let { capacity, table_status } = req.body;

        const table1 = await pool.query(
            'SELECT * FROM tables WHERE table_id = $1',
            [id],
        );
        if (capacity == null && table_status == null) {
            return res.status(400).json({ message: 'At least 1 field is required' });
        }
        if (capacity == null) {
            capacity =  table1.rows[0].capacity;};
        if (table_status == null) {
            table_status = table1.rows[0].table_status;};
        const table2 = await pool.query(
            'UPDATE tables SET capacity = $1, table_status = $2 WHERE table_id = $3 RETURNING *',
            [capacity, table_status, id],
        );
        // Check if table exists
        if (!table2.rows.length) {
            return res.status(404).json({ message: 'Table not found' });
        }
        // Update table if it exists
        res.json({ message: 'Table was updated!', table: table2.rows[0] });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
}

async function getTableById(req, res) {
    try {
        const { id } = req.params;
        const table = await pool.query(
            'SELECT * FROM tables WHERE table_id = $1',
            [id],
        );
        // Check if table exists
        if (!table.rows.length) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.json({ table: table.rows[0] });
    } catch (error) {
        console.log(error.message);
    }
}

async function getTableList(req, res) {
    try {
        const tables = await pool.query('SELECT * FROM tables');
        res.json({ tables: tables.rows });
    } catch (error) {
        console.log(error.message);
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
        res.json({ message: 'Table was deleted!', table: table.rows[0] });
    } catch (error) {
        console.log(error.message);
    }
}

export default {
    createTable,
    updateTable,
    getTableById,
    getTableList,
    deleteTableById,
};