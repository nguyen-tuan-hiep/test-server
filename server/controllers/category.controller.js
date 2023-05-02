import pool from '../models/config.js';

async function getCategoryList(req, res) {
    try {
        const allCategoryList = await pool.query('SELECT * FROM categories ORDER BY category_id ASC');
        res.json(allCategoryList.rows);
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            error: error.message
          })
    }
}

export default {
    getCategoryList
};