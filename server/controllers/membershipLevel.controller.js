import pool from '../models/config.js';

// getAllMemTypes, GET, ${PREFIX}
async function getAllMembershipLevels(req, res) {
  try {
    const allMembershipLevels = await pool.query(
      'SELECT * FROM membership_levels ORDER BY point_threshold ASC',
    );
    res.json({ message: 'success', data: allMembershipLevels.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

// getOneMemType(mem_type), GET, ${PREFIX}/${mem_type}
async function getOneMembershipLevel(req, res) {
  try {
    const { memType } = req.params;
    // memType to lowercase
    // memType = memType.toLowerCase();
    // console.log(memType);
    const membershipLevel = await pool.query(
      'SELECT * FROM membership_levels where mem_type = $1',
      [memType],
    );
    if (!membershipLevel.rows.length) {
      return res.status(500).json({ message: 'Membership level not found' });
    }
    res.json({ message: 'success', data: membershipLevel.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

// create(data), POST, ${PREFIX}/create
async function createMembershipLevel(req, res) {
  try {
    const { memType, pointThreshold, accumulation } = req.body;
    if (!memType || pointThreshold === null || !accumulation) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const membershipLevel = await pool.query(
      'INSERT INTO membership_levels (mem_type, point_threshold, accumulation) VALUES ($1, $2, $3) RETURNING *',
      [memType, pointThreshold, accumulation],
    );
    res.json({ message: 'Membership level was created!', data: membershipLevel.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

// update(mem_type, data), PATCH, ${PREFIX}/${mem_type}
// Patch
async function updateMembershipLevel(req, res) {
  try {
    const { memType } = req.params;
    // check if memtype exists
    const membershipLevel = await pool.query(
      'SELECT * FROM membership_levels WHERE mem_type = $1',
      [memType],
    );
    if (!membershipLevel.rows.length) {
      return res.status(500).json({ message: 'Membership level not found' });
    }
    // check the update field
    const requestBody = req.body;
    const queryFields = Object.keys(requestBody);
    const allowedFields = ['point_threshold', 'accumulation'];
    const isValidOperation = queryFields.every((field) => allowedFields.includes(field));
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid fields' });
    }
    // update
    const updateQuery = queryFields.map((field, index) => `${field} = $${index + 1}`);
    const updateQueryStr = updateQuery.join(', ');
    const updateQueryValues = Object.values(requestBody);
    const updatedMembershipLevel = await pool.query(
      `UPDATE membership_levels SET ${updateQueryStr} WHERE mem_type = $${
        updateQueryValues.length + 1
      } RETURNING *`,
      [...updateQueryValues, memType],
    );
    res.json({ message: 'Membership level was updated!', data: updatedMembershipLevel.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

// delete(mem_type), DELETE, ${PREFIX}/${mem_type}
async function deleteMembershipLevel(req, res) {
  try {
    const { memType } = req.params;
    // check if memtype exists
    const membershipLevel = await pool.query(
      'SELECT * FROM membership_levels WHERE mem_type = $1',
      [memType],
    );
    if (!membershipLevel.rows.length) {
      return res.status(500).json({ message: 'Membership level not found' });
    }
    // delete
    await pool.query('DELETE FROM membership_levels WHERE mem_type = $1', [memType]);
    res.json({ message: 'Membership level was deleted!' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

export default {
  getAllMembershipLevels,
  getOneMembershipLevel,
  createMembershipLevel,
  updateMembershipLevel,
  deleteMembershipLevel,
};
