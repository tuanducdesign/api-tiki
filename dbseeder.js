const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const shops = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/shops.json`, 'utf-8')
);
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);

// Import data
const importData = async () => {
  try {
    await Shop.create(shops);
    await Product.create(products);
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Shop.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data deleted successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
