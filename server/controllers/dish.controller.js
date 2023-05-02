import pool from '../models/config.js';

async function getAllDishes(req, res) {
    try {
        const allDishes = await pool.query('SELECT * FROM dishes ORDER BY dish_id ASC');
        res.json({ status: "success", data: allDishes.rows });
    }
    catch (error) {
        console.log(error.message);
        return res.status(404).json({
            error: error.message
        })
    };
};

async function getOneDishById(req, res) {
    try {
        const { id } = req.params;
        const dish = await pool.query(
            'SELECT * FROM dishes WHERE dish_id = $1', [id],
        );
        if (!dish.rows.length) {
            return res.status(404).json({ message: "Dish not found" })
        };
        res.json({ status: "success", data: dish.rows });
    }
    catch (error) {
        console.log(error.message);
        return res.status(404).json({
            error: error.message
        })
    };
};

async function searchDishByName(req, res) {
    try {
        const { name } = req.body;
        // console.log(`${name}`);
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        };
        const dishes = await pool.query(
            'SELECT * FROM dishes WHERE dish_name ILIKE $1 ORDER BY dish_id ASC',
            [`%${name}%`],
        );
        if (!dishes.rows.length) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        return res.json({ status: "success", data: dishes.rows });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            error: error.message
        })
    }
};

async function createDish(req, res) {
    try {
        const { dish_name, discription, price, dish_status, category_id, menu_id } = req.body
        if (!dish_name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!price) {
            return res.status(400).json({ message: 'Price is required' });
        }

        const dish = await pool.query(
            'INSERT INTO dishes (dish_name, discription, price, dish_status, category_id, menu_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [dish_name, discription, price, dish_status, category_id, menu_id],
        );
        // res.json({ status: "success", message: 'Dish was created', data: dish.rows[0] });
        res.json({ message: 'Dish was created!', data: dish.rows[0] });

    }
    catch (error) {
        console.log(error.message);
    };
};

async function deleteDishById(req, res) {
    try {
        const { id } = req.params;
        // Check if dish exists
        const dish = await pool.query(
            'SELECT * FROM dishes WHERE dish_id = $1', [id],
        );
        if (!dish.rows.length) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        // Delete dish if it exists
        await pool.query('DELETE FROM dishes WHERE dish_id = $1', [id]);
        res.json({ status: "success", message: 'Dish was deleted!' });
    } catch (error) {
        console.log(error.message);
    }
};

async function updateDish(req, res) {
    try {
        const { id } = req.params;
        // console.log(`${id}`);
        // Check if dish exists
        const dish = await pool.query(
            'SELECT * FROM dishes WHERE dish_id = $1', [id],
        );
        if (!dish.rows.length) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        // update dish
        const { dish_name, discription, price, dish_status, category_id, menu_id } = req.body;
        if (!dish_name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!price) {
            return res.status(400).json({ message: 'Price is required' });
        }
        const updated_dish = await pool.query(
            'UPDATE dishes SET dish_name = $1, discription = $2, price = $3, dish_status = $4, category_id=$5, menu_id=$6 WHERE dish_id = $7 RETURNING *',
            [dish_name, discription, price, dish_status, category_id, menu_id, id],
        );
        res.json({ status: "success", message: 'Dish was updated!', data: dish.rows[0] });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    };
};

export default {
    getAllDishes,
    getOneDishById,
    searchDishByName,
    createDish,
    deleteDishById,
    updateDish
};
