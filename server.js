const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const fileupload = require('express-fileupload');
const path = require('path');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// sanitize middleware to prevent NoSQL injection
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

// Rate limit 100 requests per 10 mins
let limit;
process.env.NODE_ENV === 'development' ? limit = 500 : limit = 100;
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: limit
});
app.use(limiter);

// Prevent http params polution
app.use(hpp());

// Enable CORS
app.use(cors());

// File upload 
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Morgan middleware
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;

// Mount router
const shops = require('./routes/shops');
const products = require('./routes/products');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const orders = require('./routes/orders');
app.use('/api/v1/shops', shops);
app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/orders', orders)

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server and exit
  server.close(() => process.exit(1));
});
