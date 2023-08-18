import pool from '../models/config.js';

async function getAllReservations(req, res) {
  try {
    // Sync reservations
    await pool.query('CALL delete_old_reservations()');

    const allReservations = await pool.query(
      'SELECT * FROM reservations ORDER BY res_id ASC',
    );
    return res.status(200).json(allReservations.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function createReservation(req, res) {
  try {
    const { phone, table_id, res_date, res_time_start } = req.body;

    // check table exists
    const table = await pool.query('SELECT * FROM tables WHERE table_id = $1', [
      table_id,
    ]);
    if (!table.rows.length) {
      return res.status(400).json({ message: 'Table not found', table_id });
    }

    // call the procedure
    await pool.query('CALL delete_old_reservations()');

    // check if table is already in use in that time
    const reservationTable = await pool.query(
      'SELECT * FROM reservations WHERE table_id = $1 AND res_date = $2 AND res_time_start = $3',
      [table_id, res_date, res_time_start],
    );
    if (reservationTable.rows.length) {
      return res
        .status(400)
        .json({ message: 'Table is already reserved at this time', table_id });
    }
    if (!table_id) {
      return res.status(400).json({ message: 'Table is required' });
    }
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }
    if (!res_date) {
      return res.status(400).json({ message: 'Reservation date is required' });
    }
    if (!res_time_start) {
      return res.status(400).json({ message: 'Reservation time is required' });
    }

    const reservation = await pool.query(
      'INSERT INTO reservations (phone, res_date, res_time_start, table_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [phone, res_date, res_time_start, table_id],
    );
    return res.status(200).json({
      message: 'Reservation was created!',
      reservation: reservation.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteByReservationId(req, res) {
  try {
    const reservationId = req.params.id;
    const deletedReservation = await pool.query(
      'DELETE FROM reservations WHERE res_id = $1 RETURNING *',
      [reservationId],
    );
    if (deletedReservation.rows.length) {
      return res.status(200).json({
        message: 'Reservation was deleted!',
        reservation: deletedReservation.rows[0],
      });
    }
    return res.status(400).json({ message: 'Reservation not found!' });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function searchByPhoneOrTableId(req, res) {
  try {
    const { phone } = req.query;
    let queryText = `SELECT * FROM reservations`;

    const queryParams = [];

    if (phone) {
      queryText += ' WHERE';

      if (phone) {
        queryText += ` REPLACE(phone, ' ', '') ILIKE $1`;
        queryParams.push(`%${phone}%`);
      }
    }

    queryText += ' ORDER BY table_id ASC';

    const reservations = await pool.query(queryText, queryParams);

    if (reservations.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.status(200).json(reservations.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAvailableTables(req, res) {
  try {
    const { capacity, res_date, res_time_start } = req.query;

    await pool.query('CALL delete_old_reservations()');

    const availableTables = await pool.query(
      'SELECT * FROM tables WHERE capacity >= $1 AND table_id NOT IN (SELECT table_id FROM reservations WHERE res_date = $2 AND res_time_start = $3) ORDER BY capacity ASC',
      [capacity, res_date, res_time_start],
    );
    return res.status(200).json(availableTables.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default {
  getAllReservations,
  createReservation,
  searchByPhoneOrTableId,
  getAvailableTables,
  deleteByReservationId,
};
