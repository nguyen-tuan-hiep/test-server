const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const customerRouter = require('./routes/customer.router');
const jwtAuthRouter = require('./routes/jwtAuth.router');
const dashboardRouter = require('./routes/dashboard.router');
const uploadRouter = require('./routes/uploadImage.router');
const exportCsvRouter = require('./routes/exportData.router');
const studentRouter = require('./routes/student.router');

dotenv.config();
const app = express();

app.use(cors());
// set up middleware to serve static files from the public folder
app.use('/', express.static(path.join(__dirname, '../', 'client', 'public')));
app.use(express.json());

const port = process.env.PORT || 8080;

app.use('/customers', customerRouter);
app.use('/auth', jwtAuthRouter);
app.use('/dashboard', dashboardRouter);
app.use('/upload', uploadRouter);
app.use('/export', exportCsvRouter);
app.use('/students', studentRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
