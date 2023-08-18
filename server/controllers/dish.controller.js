/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import pool from '../models/config.js';

async function getAllDishes(req, res) {
  try {
    const allDishes = await pool.query(
      'SELECT * FROM dishes INNER JOIN menus ON dishes.menu_id = menus.menu_id WHERE dish_status = 1 ORDER BY dish_id ASC',
    );
    return res.status(200).json({ message: 'success', data: allDishes.rows });
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
    const dish = await pool.query(
      'SELECT * FROM dishes INNER JOIN menus ON dishes.menu_id = menus.menu_id WHERE dish_status = 1 AND dish_id = $1',
      [id],
    );
    if (!dish.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    return res.status(200).json({ message: 'success', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

// .TODO: searchDishByName name with space, ex: 'Burger King'
async function searchDishByName(req, res) {
  console.log('Hello');
  try {
    const { name } = req.query;
    if (!name) {
      return getAllDishes(req, res);
    }
    const dishes = await pool.query(
      'SELECT * FROM dishes INNER JOIN menus ON dishes.menu_id = menus.menu_id WHERE dish_status = 1 AND LOWER(dish_name) LIKE LOWER($1) ORDER BY dish_id ASC',
      [`%${name}%`],
    );

    if (!dishes.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    return res.status(200).json({ message: 'success', data: dishes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createDish(req, res) {
  try {
    console.log(req.body);
    const { name, categoryId, price, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }

    const dish = await pool.query(
      'INSERT INTO dishes (dish_name, menu_id, price, description, dish_status) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [name, categoryId, price, description, 1],
    );
    // res.json({ message: "success", message: 'Dish was created', data: dish.rows[0] });
    return res
      .status(200)
      .json({ message: 'Dish was created!', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
    // eslint-disable-next-line linebreak-style
    return res
      .status(500)
      .json({ message: `Unexpected error occurred: ${error.message}` });
  }
}

async function deleteDishById(req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    // Check if dish exists
    let dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [
      id,
    ]);
    if (!dish.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    // Delete dish if it exists (soft delete, only change the status to 0)
    // await pool.query('DELETE FROM dishes WHERE dish_id = $1', [id]);
    dish = await pool.query(
      'UPDATE dishes SET dish_status = 0 WHERE dish_id = $1 RETURNING *',
      [id],
    );
    return res
      .status(200)
      .json({ message: 'Dish is deleted!', data: dish.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Delete unsuccessful' });
  }
}
// TODO: post => patch
async function updateDish(req, res) {
  try {
    console.log(req.body);
    const { id } = req.params;
    // Check if dish exists
    const dish = await pool.query('SELECT * FROM dishes WHERE dish_id = $1', [
      id,
    ]);
    if (!dish.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    // update dish
    const requestBody = req.body;
    const queryFields = Object.keys(requestBody)
      .filter((field) => requestBody[field] !== undefined)
      .map(
        (field) => `${field} = $${Object.keys(requestBody).indexOf(field) + 1}`,
      )
      .join(', ');
    const queryValues = Object.values(requestBody).filter(
      (value) => value !== undefined,
    );

    if (queryFields && queryValues.length > 0) {
      const updatedDish = await pool.query(
        `UPDATE dishes SET ${queryFields} WHERE dish_id = $${
          queryValues.length + 1
        } RETURNING *`,
        [...queryValues, id],
      );
      return res.status(200).json({
        message: 'Dish was updated!',
        data: updatedDish.rows[0],
      });
    }
    return res.status(400).json({ message: 'Missing body' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getTop5DishesBetweenDate(req, res) {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'Start date and end date are required' });
    }
    if (startDate > endDate) {
      return res
        .status(400)
        .json({ message: 'Start date must be before end date' });
    }
    const dishes = await pool.query(
      'SELECT dish_id, COUNT(*) as dish_count FROM order_dishes od JOIN orders o ON od.order_id = o.order_id WHERE o.order_date BETWEEN $1 AND $2 GROUP BY dish_id ORDER BY dish_count DESC LIMIT 5;',
      [startDate, endDate],
    );
    if (!dishes.rows.length) {
      return res.status(500).json({ message: 'Dish not found' });
    }
    return res.status(200).json({ message: 'success', data: dishes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
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
