const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]

    }
)

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel