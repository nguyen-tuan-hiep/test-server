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
    return res.json({ message: 'Event was deleted!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
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
    return res.json({ message: 'Event was updated!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function createEvent(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const event = await pool.query(
      'INSERT INTO events (event_name) VALUES ($1) RETURNING *',
      [name],
    );
    return res.json({ message: 'Event was created!', data: event.rows[0] });
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
    return res.json({ message: 'Found!' }, { data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function searchEventByName(req, res) {
  try {
    const { name } = req.body;
    const events = await pool.query(
      `SELECT * FROM events WHERE REPLACE(event_name, ' ','') ILIKE $1 ORDER BY event_id ASC`,
      [`%${name}%`],
    );
    if (!events.rows.length)
      return res.status(404).json({ message: 'Event not found' });
    return res.json({ message: 'Found', data: events.rows });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

export default {
  deleteEvent,
  updateEvent,
  createEvent,
  getEventById,
  searchEventByName,
};
