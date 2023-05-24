import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import customerRouter from './routes/customer.router.js';
import jwtAuthRouter from './routes/jwtAuth.router.js';
import dashboardRouter from './routes/dashboard.router.js';
import uploadRouter from './routes/uploadImage.router.js';
import exportDataRouter from './routes/exportData.router.js';
import studentRouter from './routes/student.router.js';

import eventRouter from './routes/event.router.js';
import orderRouter from './routes/order.router.js';
import tableRouter from './routes/table.router.js';
import statisticRouter from './routes/statistic.router.js';

dotenv.config();
const app = express();

app.use(cors());
// set up middleware to serve static files from the public folder
// app.use('/', express.static(path.join(__dirname, '../', 'client', 'public')));

app.use(express.json());

const port = process.env.PORT || 8080;

app.use('/customers', customerRouter);
app.use('/auth', jwtAuthRouter);
app.use('/dashboard', dashboardRouter);
app.use('/upload', uploadRouter);
app.use('/export', exportDataRouter);
app.use('/students', studentRouter);

app.use('/events', eventRouter);
app.use('/orders', orderRouter);
app.use('/tables', tableRouter);
app.use('/statistic', statisticRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default app;
