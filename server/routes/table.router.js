import express from 'express';
import tableController from '../controllers/table.controller.js';

const router = express.Router();

// createTable: (data) (pos), url = `${PREFIX}/create`
// updateTable: (id, data) (patch), url = `${PREFIX}/${id}`
// getTableById: (id) (get), url = `${PREFIX}/${id}`
// getTableList: () (get), url = `${PREFIX}`
// deleteTableById: (id) (delete),  url = `${PREFIX}/${id}`

router.post('/create', tableController.createTable);

router.put('/:id', tableController.updateTable);

router.get('/:id', tableController.getTableById);

router.get('/', tableController.getTableList);

router.delete('/:id', tableController.deleteTableById);

export default router;