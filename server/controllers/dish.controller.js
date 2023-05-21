/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import pool from '../models/config.js';

async function getAllDishes(req, res) {
  try {
    const allDishes = await pool.query('SELECT * FROM dishes ORDER BY dish_id ASC');
    res.json({ message: 'success', data: allDishes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getOneDishById(req, res) {
  try {
    const { id } = req.params;
    const dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [id]);
    if (!dish.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    res.json({ message: 'success', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

// .TODO: searchDishByName name with space, ex: 'Burger King'
async function searchDishByName(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const dishes = await pool.query(
      'SELECT * FROM dishes WHERE dish_name ILIKE $1 ORDER BY dish_id ASC',
      [`%${name}%`],
    );
    if (!dishes.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    return res.json({ message: 'success', data: dishes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createDish(req, res) {
  try {
    const { dishName, description, price, dishStatus, categoryId, menuId } = req.body;
    if (!dishName) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }

    const dish = await pool.query(
      'INSERT INTO dishes (dish_name, description, price, dish_status, category_id, menu_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [dishName, description, price, dishStatus, categoryId, menuId],
    );
    // res.json({ message: "success", message: 'Dish was created', data: dish.rows[0] });
    res.json({ message: 'Dish was created!', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
    // eslint-disable-next-line linebreak-style
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function deleteDishById(req, res) {
  try {
    const { id } = req.params;
    // Check if dish exists
    let dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [id]);
    if (!dish.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    // Delete dish if it exists (soft delete, only change the status to 0)
    // await pool.query('DELETE FROM dishes WHERE dish_id = $1', [id]);
    dish = await pool.query('UPDATE dishes SET dish_status = 0 WHERE dish_id = $1 RETURNING *', [
      id,
    ]);
    res.json({ message: 'Dish status is changed successfully!', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
  }
}
// TODO: post => patch
async function updateDish(req, res) {
  try {
    const { id } = req.params;
    // Check if dish exists
    const dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [id]);
    if (!dish.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    // update dish
    const requestBody = req.body;
    const queryFields = Object.keys(requestBody)
      .filter((field) => requestBody[field] !== undefined)
      .map((field) => `${field} = $${Object.keys(requestBody).indexOf(field) + 1}`)
      .join(', ');
    const queryValues = Object.values(requestBody).filter((value) => value !== undefined);

    if (queryFields && queryValues.length > 0) {
      const updatedDish = await pool.query(
        `UPDATE dishes SET ${queryFields} WHERE dish_id = $${queryValues.length + 1} RETURNING *`,
        [...queryValues, id],
      );
      res.json({
        message: 'Dish was updated!',
        data: updatedDish.rows[0],
      });
    } else {
      res.status(400).json({ message: 'Missing body' });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function getTop5DishesBetweenDate(req, res) {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    if (startDate > endDate) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    const dishes = await pool.query(
      'SELECT dish_id, COUNT(*) as dish_count FROM order_dishes od JOIN orders o ON od.order_id = o.order_id WHERE o.order_date BETWEEN $1 AND $2 GROUP BY dish_id ORDER BY dish_count DESC LIMIT 5;',
      [startDate, endDate],
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
  getAllDishes,
  getOneDishById,
  searchDishByName,
  createDish,
  deleteDishById,
  updateDish,
  getTop5DishesBetweenDate,
};
