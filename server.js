const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Morgan middleware
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;

// Mount router
const shops = require('./routes/shops');
app.use('/api/v1/shops', shops);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
