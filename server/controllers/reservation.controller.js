import pool from '../models/config';

async function getAllReservations(req, res) {
  try {
    // call the procedure
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
        .json({ message: 'Table is already in use', table_id });
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

export default {
  getAllReservations,
  createReservation,
  deleteByReservationId,
};
