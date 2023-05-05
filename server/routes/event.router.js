import express from 'express';
import eventController from '../controllers/event.controller.js';

const router = express.Router();

// delete an event by id
router.delete('/:id', eventController.deleteEvent);

// update
router.put('/:id', eventController.updateEvent);

// create
router.post('/create', eventController.createEvent);

// get
router.get('/:id', eventController.getEventById);

// search
router.post('/search', eventController.searchEventByName);

export default router;
