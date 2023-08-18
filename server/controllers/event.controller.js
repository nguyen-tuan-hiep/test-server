import pool from '../models/config.js';

async function getAllEvents(req, res) {
  try {
    const allEvents = await pool.query(
      'SELECT * FROM events ORDER BY event_id ASC',
    );
    return res.status(200).json(allEvents.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const event = await pool.query(
      'DELETE FROM events WHERE event_id = $1 RETURNING *',
      [id],
    );
    // Check if event exists
    if (!event.rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res
      .status(200)
      .json({ message: 'Event was deleted!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateEvent(req, res) {
  try {
    const { name, description, beginTime, closeTime, poster } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const event = await pool.query(
      'UPDATE events SET event_name = $1, description = $2, begin_time = $3, close_time = $4, poster = $5 WHERE event_id = $6 RETURNING *',
      [name, description, beginTime, closeTime, poster, id],
    );
    // Check if event exists
    if (!event.rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Update event if it exists
    return res
      .status(200)
      .json({ message: 'Event was updated!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function updateEventIncludeDish(req, res) {
  try {
    const { name, description, beginTime, closeTime, poster, dishes } =
      req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    // Update event if it exists
    const event = await pool.query(
      'UPDATE events SET event_name = $1, description = $2, begin_time = $3, close_time = $4, poster = $5 WHERE event_id = $6 RETURNING *',
      [name, description, beginTime, closeTime, poster, id],
    );
    console.log(event.rows);
    // Check if event exists
    if (!event.rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Update event_dishes table

    // Delete all dishes of event
    await pool.query('DELETE FROM event_dishes WHERE event_id = $1', [id]);
    const resData = { events: event.rows[0], dishes: [] };

    const eventId = event.rows[0].event_id;
    if (dishes) {
      // Insert new dishes of event
      const values = dishes
        .map((dish) => `(${eventId}, ${dish.dish_id}, ${dish.quantity})`)
        .join(', ');
      const results = await pool.query(
        `INSERT INTO event_dishes (event_id, dish_id, quantity) VALUES ${values} RETURNING *;`,
      );
      resData.dishes = results.rows;
    }

    return res
      .status(200)
      .json({ message: 'Event was updated!', data: resData });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function createEvent(req, res) {
  try {
    const { name, description, beginTime, closeTime, poster } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!beginTime) {
      return res.status(400).json({ message: 'Begin time is required' });
    }
    if (!closeTime) {
      return res.status(400).json({ message: 'End time is required' });
    }
    const event = await pool.query(
      'INSERT INTO events (event_name, description, begin_time, close_time, poster) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, beginTime, closeTime, poster],
    );
    return res
      .status(200)
      .json({ message: 'Event was created!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}
async function createEventIncludeDish(req, res) {
  try {
    const { name, description, beginTime, closeTime, poster, dishes } =
      req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!beginTime) {
      return res.status(400).json({ message: 'Begin time is required' });
    }
    if (!closeTime) {
      return res.status(400).json({ message: 'End time is required' });
    }
    const event = await pool.query(
      'INSERT INTO events (event_name, description, begin_time, close_time, poster) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, beginTime, closeTime, poster],
    );
    const eventId = event.rows[0].event_id;
    // dishId is an array
    console.log(dishes);
    if (dishes) {
      const values = dishes
        .map((dish) => `(${eventId}, ${dish.dish_id}, ${dish.quantity})`)
        .join(', ');
        console.log(values);
      const query = `INSERT INTO event_dishes (event_id, dish_id, quantity) VALUES ${values} RETURNING *;`;
      const eventDishes = await pool.query(query);
    }
    return res
      .status(200)
      .json({ message: 'Event was created!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await pool.query('SELECT * FROM events WHERE event_id = $1', [
      id,
    ]);
    if (!event.rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({ message: 'Found!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function searchEventByName(req, res) {
  try {
    const { name } = req.query;
    let queryText = `SELECT * FROM events`;

    const queryParams = [];

    if (name) {
      queryText += ' WHERE';
      queryText += ` REPLACE(event_name, ' ', '') ILIKE $1`;
      queryParams.push(`%${name}%`);
    }

    queryText += ' ORDER BY event_id ASC';

    const events = await pool.query(queryText, queryParams);

    if (events.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(events.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllDishesOfEvent(req, res) {
  try {
    const { id } = req.params;
    const dishes = await pool.query(
      'SELECT dish_id FROM event_dishes WHERE event_id = $1',
      [id],
    );

    return res.status(200).json(dishes.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default {
  getAllEvents,
  deleteEvent,
  updateEvent,
  createEvent,
  getEventById,
  searchEventByName,
  createEventIncludeDish,
  updateEventIncludeDish,
  getAllDishesOfEvent,
};
