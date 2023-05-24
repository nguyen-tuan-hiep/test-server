import express from 'express'
import statisticController from '../controllers/statistic.controller.js'

const router = express.Router()

router.post('/orderBetweenDate', statisticController.getOrderBetweenDate);

router.post('/top5DishesBetweenDate', statisticController.getTop5DishesBetweenDate);

export default router;