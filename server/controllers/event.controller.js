import pool from '../models/config.js';

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
    res.json({ message: 'Event was deleted!', event: event.rows[0] });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const event = await pool.query(
      'UPDATE events SET event_name = $1 WHERE event_id = $2 RETURNING *',
      [name, id],
    );
    // Check if event exists
    if (!event.rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Update event if it exists
    res.json({ message: 'Event was updated!', event: event.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function createEvent(req, res) {
  try {
    const { name } = req.body;
    if ( !name ) {
      res.status(400).json({ message: 'All fields are required' });
    }
    const event = await pool.query(
      'INSERT INTO events (event_name) VALUES ($1) RETURNING *',
      [name],
    );
    res.json({ message: 'Event was created!', event: event.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await pool.query(
      'SELECT * FROM events WHERE event_id = $1',
      [id],
    );
    if (!event.rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
}

async function searchEventByName(req, res) {
  try {
    const { name } = req.body;
    const events = await pool.query(
      `SELECT * FROM events WHERE REPLACE(event_name, ' ','') ILIKE $1 ORDER BY event_id ASC`,
      [`%${name}%`],
    );
    return res.json(events.rows);
  } catch (error) {
    console.log(error.message);
  }
}

export default {
  deleteEvent,
  updateEvent,
  createEvent,
  getEventById,
  searchEventByName,
};
