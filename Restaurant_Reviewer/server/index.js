const express = require('express')
const mongoose=require('mongoose')
const cors = require('cors')
const UserModel =require('./models/User')
const Restaurant = require('./models/Restaurant'); // Import the Restaurant model
const bodyParser = require ('body-parser')
const Feedbacks = require('./models/Feedback');  // Adjust the import path
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt= require('jsonwebtoken')

const app = express()

app.use(express.json()); // transfer fata from frontend to backend in json format
app.use(cors({
  origin:["http://localhost:5173"],
   methods: ["GET", "POST"],
  credentials: true}
  ));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({
    extended : true

}));
app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/restaurantreviewer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })  //connecting to the database connection string
//mongoose.connect("mongodb://127.0.0.1:27017/employee") 
//if localhost doesn't work try 127.0.0.1


app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  bcrypt.hash(password, 10 )
  .then(hash=>{
    UserModel.create({name, email, password:hash})
    .then(user => res.json({status:"OK"}))
    .catch(err=>res.json(err))

  }).catch(err => res.json(err))

})

//Create a token that is valid for one day
app.post('/login', (req,res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if (user) {
          bcrypt.compare(password, user.password, (err, response)=>{
            if(response)
            {
              const token=jwt.sign({email: user.email}, 
                "jwt-secret-key", {expiresIn:"1d"})
                res.cookie('token', token)
                return res.json("Success")



            }else{
              return res.json("Incorrect Password")
            }
          })

         }
        else{
            res.json("does not exist")
        }

    })
})

app.post('/feedbacks', async (req, res) => {
  const { restaurantId, comment } = req.body;

  const newFeedback = new Feedbacks({
    restaurantId,
    comment,
  });

  try {
    const savedFeedback = await newFeedback.save();
    res.json(savedFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Error saving feedback' });
  }
});

//Updating database to increment the value of the positive comments 
app.put('/restaurants/:id/increment', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the restaurant by ID and increment the TotalPositiveComments field by 1
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $inc: { TotalPositiveComments: 1 } }, // Use $inc to increment by 1
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/restaurants/:id/incrementNeg', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the restaurant by ID and increment the TotalPositiveComments field by 1
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $inc: { TotalNegativeComments: 1 } }, // Use $inc to increment by 1
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/restaurants', async (req, res) => {
    try {
      const { category } = req.query;

      // If a category filter is provided, filter by category, else get all restaurants
      const query = category ? { category } : {};

      const restaurants = await Restaurant.find(query);

      res.json(restaurants);
    } catch (err) {
      console.log(err);
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






//Specifying the port
app.listen(3001, ()=>{
console.log("running")
})
