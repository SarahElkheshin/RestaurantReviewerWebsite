const mongoose = require('mongoose')
const FeedbackSchema = new mongoose.Schema(
    {
        comment: String,

    }
)

const FeedbackModel = mongoose.model("feedbacks", FeedbackSchema)
module.exports = FeedbackModel