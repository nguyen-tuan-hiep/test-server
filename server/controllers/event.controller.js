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
    return res.json({ message: 'Event was deleted!', data: event.rows[0] });
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
    return res.json({ message: 'Found!', data: event.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function searchEventByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return getAllEvents(req, res);
    }
    const events = await pool.query(
      'SELECT * FROM events WHERE event_name ILIKE $1 ORDER BY event_id ASC',
      [`%${name}%`],
    );
    if (!events.rows.length) {
      return res.status(500).json({ message: 'Event not found' });
    }
    return res.json({ message: 'success', data: events.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

export default {
  getAllEvents,
  deleteEvent,
  updateEvent,
  createEvent,
  getEventById,
  searchEventByName,
};
