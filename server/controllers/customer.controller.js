const pool = require("../models/config");

async function getAllCustomers(req, res) {
	try {
		const allCustomers = await pool.query("SELECT * FROM customers");
		res.json(allCustomers.rows);
	} catch (error) {
		console.log(error.message);
	}
}

async function createCustomer(req, res) {
	try {
		const name = req.body.name;
		if (!name) {
			return res.status(400).json({ message: "Name is required" });
		}
		const customer = await pool.query(
			"INSERT INTO customers (name) VALUES ($1) RETURNING *",
			[name]
		);
		if (customer.length === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		res.json({ message: "Customer was created!" });
	} catch (error) {
		console.log(error.message);
		res.status(400).json({ message: error.message });
	}
}

async function updateCustomer(req, res) {
	try {
		const id = req.params.id;
		const name = req.body.name;
		if (!name) {
			return res.status(400).json({ message: "Name is required" });
		}
		const { rows } = await pool.query(
			"UPDATE customers SET name = $1 WHERE id = $2 RETURNING *",
			[name, id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		res.json({ message: "Customer was updated!", customer: rows[0] });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
}

async function getOneCustomer(req, res) {
	try {
		const id = req.params.id;
		const customer = await pool.query(
			"SELECT * FROM customers WHERE id = $1",
			[id]
		);
		if (customer.rows.length === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		res.json(customer.rows[0]);
	} catch (error) {
		console.log(error.message);
	}
}

async function deleteCustomer(req, res) {
	try {
		const id = req.params.id;
		// Check if customer exists
		const customer = await pool.query(
			"SELECT * FROM customers WHERE id = $1",
			[id]
		);
		if (customer.rows.length === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		// Delete customer if it exists
		await pool.query("DELETE FROM customers WHERE id = $1", [id]);
		res.json({ message: "Customer was deleted!" });
	} catch (error) {
		console.log(error.message);
	}
}
module.exports = {
	getAllCustomers,
	createCustomer,
	updateCustomer,
	getOneCustomer,
	deleteCustomer,
};
