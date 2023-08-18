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
// router.post('/:id', eventController.updateEvent);

// update include dish (delete event_dish and insert new event_dish)
router.post('/:id', eventController.updateEventIncludeDish);

// create
router.post('/create', eventController.createEvent);

//create 
router.post('/createv2', eventController.createEventIncludeDish);  

// get all dishes of an event
router.get('/getDishes/:id', eventController.getAllDishesOfEvent);

// get
router.get('/:id', eventController.getEventById);

export default router;
