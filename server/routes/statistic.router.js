import express from 'express';
import statisticController from '../controllers/statistic.controller.js';

const router = express.Router();

router.get('/orderBetweenDate', statisticController.getOrderBetweenDate);

router.post(
  '/top5DishesBetweenDate',
  statisticController.getTop5DishesBetweenDate,
);

router.get('/', statisticController.getStatistic);

export default router;
