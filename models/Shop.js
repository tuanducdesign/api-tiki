const mongoose = require('mongoose');
const slugify = require('slugify');

// SCHEMA SETUP
const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Shop name cannot be longer than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be longer than 500 characters']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create shop slug from the name before save
ShopSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g });
  next();
});

module.exports = mongoose.model('Shop', ShopSchema);
