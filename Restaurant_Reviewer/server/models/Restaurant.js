// const mongoose = require('mongoose');



// const restaurantSchema = new mongoose.Schema({
//   name: String,
//   image: String,
//   TotalPositiveComments: Number,
//   TotalNeutralComments: Number,
//   TotalNegativeComments: Number,
// });

// const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  TotalPositiveComments: {
    type: Number,
    default: 0, // Set a default value if needed
  },
  TotalNeutralComments: {
    type: Number,
    default: 0,
  },
  TotalNegativeComments: {
    type: Number,
    default: 0,
  },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
