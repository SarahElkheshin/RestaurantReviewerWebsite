const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant', // Reference to the Restaurant model
  },
});

const FeedbackModel = mongoose.model('feedbacks', FeedbackSchema);

module.exports = FeedbackModel;
