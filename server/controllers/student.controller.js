const pool = require("../models/config");

async function getStudent(req, res) {
	try {
		const allCustomers = await pool.query("select s.id id, s.name name, s.age age, c.id class_id, c.name class_name from student s join class c on s.class_id = c.id order by s.id;");
		res.json(allCustomers.rows);
	} catch (error) {
		console.log(error.message);
	}
}

module.exports = {
    getStudent,
};