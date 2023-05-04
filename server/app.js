import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import customerRouter from './routes/customer.router.js';
import jwtAuthRouter from './routes/jwtAuth.router.js';
import dashboardRouter from './routes/dashboard.router.js';
import uploadRouter from './routes/uploadImage.router.js';
import exportDataRouter from './routes/exportData.router.js';
import studentRouter from './routes/student.router.js';
import categoryRouter from './routes/category.router.js';
import dishRouter from './routes/dish.router.js';

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

app.use('/category', categoryRouter);
app.use('/dish', dishRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default app;
