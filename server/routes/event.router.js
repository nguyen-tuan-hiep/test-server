import express from 'express';
import eventController from '../controllers/event.controller.js';

const router = express.Router();

// get all events
router.get('/', eventController.getAllEvents);

// search
router.get('/search', eventController.searchEventByName);

// delete an event by id
router.delete('/:id', eventController.deleteEvent);

// update
router.patch('/:id', eventController.updateEvent);

// create
router.post('/create', eventController.createEvent);

// get
router.get('/:id', eventController.getEventById);

export default router;
