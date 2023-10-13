import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Restaurant.css';

function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [category, setCategory] = useState('all'); // Default to 'all' category
  const [comments, setComments] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/restaurants')
      .then(response => {
        setRestaurants(response.data);
        // Initialize comments for each restaurant
        const initialComments = response.data.reduce((acc, restaurant) => {
          acc[restaurant._id] = "";
          return acc;
        }, {});
        setComments(initialComments);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [data, setData] = useState({ comment: "" });

  const handleChange = (e, restaurantId) => {
    const name = e.target.name;
    const value = e.target.value;
    setComments({
      ...comments,
      [restaurantId]: value,
    });
  };
  

  const handleSubmit = async (e, restaurantId) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("apikey", "USkeTl8EQKqJCavRABKkLaVQ61j0R6aJ");
    
    var raw = comments[restaurantId];
    
    var requestOptions = {
      method: 'POST',
      redirect: 'follow',
      headers: myHeaders,
      body: raw
    };
    
    fetch("https://api.apilayer.com/sentiment/analysis", requestOptions)
      .then(response => response.text())
      .then(result => {

        const data = JSON.parse(result);
        const sentiment = data.sentiment;

        console.log(sentiment)

        if (sentiment === 'positive') {
          // Make an HTTP request to increment the TotalPositiveComments field
           axios.put(`http://localhost:3001/restaurants/${restaurantId}/increment`)
          .then(response => {
            // Update the React state to reflect the change
           const updatedRestaurants = restaurants.map(restaurant => {
             if (restaurant._id === restaurantId) {
                return { ...restaurant, TotalPositiveComments: restaurant.TotalPositiveComments + 1 };
              }
          return restaurant;
          });
          setRestaurants(updatedRestaurants);
          })
          .catch(error => {
           console.error('Error updating restaurant:', error);
         });
          
            
        }
        else if (sentiment === 'negative') {
          // Make an HTTP request to your backend API to update the restaurant data
          axios.put(`http://localhost:3001/restaurants/${restaurantId}/incrementNeg`)
          .then(response=>{
           

            const updatedRestaurants = restaurants.map(restaurant => {
              if (restaurant._id === restaurantId) {
                 return { ...restaurant, TotalNegativeComments: restaurant.TotalNegativeComments + 1 };
               }
           return restaurant;
              });
              setRestaurants(updatedRestaurants);
              

          })

           
            
        }

    
    })
      .catch(error => console.log('error', error));   
  };

  // Filter restaurants based on the selected category
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (category === 'all') return true;
    return restaurant.category === category;
  });

  return (
    <div className="d-flex flex-column align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-75">
        <div className="topnav">
          <Link to="/home" className="active">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <h2>Restaurant List</h2>

        {/* Category Selection */}
        <div className="category-selection">
          <label htmlFor="category">Select a Category:</label>
          <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        {/* Restaurants */}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredRestaurants.map((restaurant, index) => (
            <div key={index} className="col">
              <div className="card">
                <img src={restaurant.image} className="card-img-top h-100" alt={restaurant.name} />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    Positive Comments: {restaurant.TotalPositiveComments}
                    <br />
                    Neutral Comments: {restaurant.TotalNeutralComments}
                    <br />
                    Negative Comments: {restaurant.TotalNegativeComments}
                  </p>

                  <form method="post" onSubmit={(e) => handleSubmit(e, restaurant._id)} >
                    <textarea name="comment" id="" className="form-control" rows="4" placeholder="Enter your comment here"  onChange={(e) => handleChange(e, restaurant._id)} value={comments[restaurant._id]} />
                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                  </form>

                </div>
              </div>
            </div>
          ))}
        </div>

        <Link to="/home" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    </div>
  );
}

export default Restaurant;
