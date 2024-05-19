const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        phone: String, // Add phone field
        favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
    }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
