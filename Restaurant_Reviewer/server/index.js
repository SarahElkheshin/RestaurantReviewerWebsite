const express = require('express')
const mongoose=require('mongoose')
const cors = require('cors')
const UserModel =require('./models/User')
const Restaurant = require('./models/Restaurant'); // Import the Restaurant model
const bodyParser = require ('body-parser')
const app = express()

app.use(express.json()); // transfer fata from frontend to backend in json format
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({
    extended : true

}));

mongoose.connect('mongodb://localhost:27017/restaurantreviewer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })  //connecting to the database connection string
//mongoose.connect("mongodb://127.0.0.1:27017/employee") 
//if localhost doesn't work try 127.0.0.1


app.post('/login', (req,res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if (user) {
            if(user.password === password)
            {
                res.json("Success")
            }
            else {
                res.json("password incorrect")
            }

        }
        else{
            res.json("does not exist")
        }

    })
})

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





app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then(users=>res.json(users))
    .catch(err=>res.json(err))



})

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


//Specifying the port
app.listen(3001, ()=>{
console.log("running")
})
