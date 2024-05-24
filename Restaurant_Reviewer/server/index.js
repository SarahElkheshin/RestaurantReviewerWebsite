const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User');
const Restaurant = require('./models/Restaurant');
const bodyParser = require('body-parser');
const Feedbacks = require('./models/Feedback');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/restaurantreviewer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPassword });
    res.json({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn: "1d" });
            res.cookie('token', token);
            return res.json({ message: "Success", token });
          } else {
            return res.json("Incorrect Password");
          }
        });
      } else {
        res.json("User does not exist");
      }
    });
});

app.get('/users/profile', authenticateToken, async (req, res) => {
  const userEmail = req.user.email; // User email extracted from token
  try {
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.delete('/users/profile', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const deletedUser = await UserModel.findOneAndDelete({ email: userEmail });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/feedbacks', async (req, res) => {
  const { restaurantId, comment } = req.body;
  const newFeedback = new Feedbacks({ restaurantId, comment });
  try {
    const savedFeedback = await newFeedback.save();
    res.json(savedFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Error saving feedback' });
  }
});

app.post('/users/favorites/add', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { restaurantId } = req.body;

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.favoriteRestaurants.includes(restaurantId)) {
      return res.status(400).json({ error: 'Restaurant already in favorites.' });
    }

    user.favoriteRestaurants.push(restaurantId);
    await user.save();

    res.json({ message: 'Restaurant added to favorites' });
  } catch (error) {
    console.error('Error adding restaurant to favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/restaurants/:id/increment', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $inc: { TotalPositiveComments: 1 } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/restaurants/:id/incrementNeg', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $inc: { TotalNegativeComments: 1 } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/restaurants/:id/incrementNeutral', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $inc: { TotalNeutralComments: 1 } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/restaurants', async (req, res) => {
  try {
    const { category, type, district } = req.query;
    const filters = {};

    if (category && category !== 'all') {
      filters.category = category;
    }

    if (type && type !== 'all') {
      filters.type = type;
    }

    if (district && district !== 'all') {
      filters.district = district;
    }

    const restaurants = await Restaurant.find(filters);
    res.json(restaurants);
  } catch (err) {
    console.error(err);
  }
});

app.get('/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
  }
});

app.get('/feedbacks', async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const feedbacks = await Feedbacks.find({ restaurantId });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3001, () => {
  console.log("running");
});

