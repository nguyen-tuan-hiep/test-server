/* eslint-disable max-len */
import pool from '../models/config.js';

async function getAllDishes(req, res) {
  try {
    const allDishes = await pool.query('SELECT * FROM dishes ORDER BY dish_id ASC');
    res.json({ status: 'success', data: allDishes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      error: error.message,
    });
  }
}

async function getOneDishById(req, res) {
  try {
    const { id } = req.params;
    const dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [id]);
    if (!dish.rows.length) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json({ status: 'success', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      error: error.message,
    });
  }
}

async function searchDishByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      const allDishes = await pool.query('SELECT * FROM dishes ORDER BY dish_id ASC');
      return res.json({ status: 'success', data: allDishes.rows });
      // return res.status(400).json({ message: 'Name is required' });
    }
    const dishes = await pool.query(
      'SELECT * FROM dishes WHERE dish_name ILIKE $1 ORDER BY dish_id ASC',
      [`%${name}%`],
    );
    if (!dishes.rows.length) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    return res.json({ status: 'success', data: dishes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      error: error.message,
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
    // res.json({ status: "success", message: 'Dish was created', data: dish.rows[0] });
    res.json({ message: 'Dish was created!', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteDishById(req, res) {
  try {
    const { id } = req.params;
    // Check if dish exists
    const dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [id]);
    if (!dish.rows.length) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    // Delete dish if it exists
    await pool.query('DELETE FROM dishes WHERE dish_id = $1', [id]);
    res.json({ status: 'success', message: 'Dish was deleted!' });
  } catch (error) {
    console.log(error.message);
  }
}
// To-do: put => patch
async function updateDish(req, res) {
  try {
    const { id } = req.params;
    // Check if dish exists
    const dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [id]);
    if (!dish.rows.length) {
      return res.status(404).json({ message: 'Dish not found' });
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
        status: 'success',
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

export default {
  getAllDishes,
  getOneDishById,
  searchDishByName,
  createDish,
  deleteDishById,
  updateDish,
};
