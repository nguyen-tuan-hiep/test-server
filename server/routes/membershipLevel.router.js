import express from 'express';
import membershipLevelController from '../controllers/membershipLevel.controller.js';

const router = express.Router();
// getAllMemTypes, GET, ${PREFIX}
// create(data), POST, ${PREFIX}/create
// getOneMemType(mem_type), GET, ${PREFIX}/${mem_type}
// delete(mem_type), DELETE, ${PREFIX}/${mem_type}
// update(mem_type, data), PATCH, ${PREFIX}/${mem_type}

// get all membershipLevels
router.get('/', membershipLevelController.getAllMembershipLevels);

// create a membershipLevel
router.post('/create', membershipLevelController.createMembershipLevel);

// get one membershipLevel by memType
router.get('/:memType', membershipLevelController.getOneMembershipLevel);

// update a membershipLevel by memType
router.patch('/:memType', membershipLevelController.updateMembershipLevel);

// delete a membershipLevel by memType
router.delete('/:memType', membershipLevelController.deleteMembershipLevel);

export default router;
