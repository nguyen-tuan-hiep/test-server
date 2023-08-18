import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import customerRouter from './routes/customer.router.js';
import dashboardRouter from './routes/dashboard.router.js';
import dishRouter from './routes/dish.router.js';
import eventRouter from './routes/event.router.js';
import exportDataRouter from './routes/exportData.router.js';
import jwtAuthRouter from './routes/jwtAuth.router.js';
import orderRouter from './routes/order.router.js';
import reservationRouter from './routes/reservation.router.js';
import statisticRouter from './routes/statistic.router.js';
import tableRouter from './routes/table.router.js';
import uploadRouter from './routes/uploadImage.router.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morgan.token('url', function (req, res) {
  // Decode URI to get original URL (e.g. replace %20 with spaces)
  // return decodeURI(req.originalUrl || req.url);
  return decodeURIComponent(req.originalUrl || req.url);
});
app.use(morgan('dev'));

const port = process.env.PORT || 8080;

app.use('/customers', customerRouter);
app.use('/auth', jwtAuthRouter);
app.use('/dashboard', dashboardRouter);
app.use('/upload', uploadRouter);
app.use('/export', exportDataRouter);
app.use('/events', eventRouter);
app.use('/orders', orderRouter);
app.use('/tables', tableRouter);
app.use('/statistic', statisticRouter);
app.use('/dishes', dishRouter);
app.use('/reservations', reservationRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default app;
