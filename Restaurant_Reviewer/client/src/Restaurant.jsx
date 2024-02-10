import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Restaurant.css';

function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [category, setCategory] = useState('all'); // Default to 'all' category
  const [comments, setComments] = useState({});
  const [feedbacks, setFeedbacks] = useState({});  // Add this line


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
//ADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
const commentText = comments[restaurantId];

  // Update local state
  setComments({
    ...comments,
    [restaurantId]: "",
  });

  // Send the comment to the server
  try {
    const response = await axios.post(`http://localhost:3001/feedbacks`, {
      restaurantId,
      comment: commentText,
    });

    // Update MongoDB collection
    setFeedbacks({
      ...feedbacks,
      [response.data._id]: response.data,
    });
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
//ADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
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
    <div className="d-flex flex-column align-items-center bg-custom vh-100" id="12">
      <div className="bg-customfront p-3 rounded">
        <img className="logo" src='./src/assets/logo.png'/>
      <h2 className="heading">Restaurant Reviewer</h2>
        <div className="topnav">
          <Link to="/home" className="active">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <div className="topnav-right">
               <Link to="/login">Login</Link>
               <Link to="/register">Register</Link>
             </div>
             
        </div>
       

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
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {filteredRestaurants.map((restaurant, index) => (
            <div key={index} className="col">
               <Link to={'/restaurant/${restaurant._id}'}>
              <div className="card">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                
                  {/* <p className="card-text">
                  <img src='./src/assets/positive.png' className="emoji"/> {restaurant.TotalPositiveComments}
                    <img src='./src/assets/neutral.png' className="emoji"/> {restaurant.TotalNeutralComments}
                    <img src='./src/assets/negative.png' className="emoji"/> {restaurant.TotalNegativeComments}
                  </p> */}

                <div id="design-cast">
                    <div className="member">
                         <img src='./src/assets/positive.png' className="img-responsive img-thumbnail emoji" alt="Responsive image" />
                    </div>
                    <div className="name">
                      {restaurant.TotalPositiveComments}
                    </div>


                   <div className="member">
                          <img src='./src/assets/neutral.png' className="img-responsive img-thumbnail emoji" alt="Responsive image" />
                    </div>

                  <div className="name">
                      {restaurant.TotalNeutralComments}
                  </div>

                    <div className="member">
                          <img src='./src/assets/negative.png' className=" img-thumbnail emoji" alt="Responsive image" />
                    </div>
                    <div className="name">
                        {restaurant.TotalNegativeComments}
                      </div>
                  </div>       

                    
 <form method="post" onSubmit={(e) => handleSubmit(e, restaurant._id)} >



  
                    <textarea name="comment" id="" className="card-textarea" rows="2" placeholder="Enter your comment here"  onChange={(e) => handleChange(e, restaurant._id)} value={comments[restaurant._id]} />
                    <button type="submit" className="btn-primary" id="submit-button">Submit</button>
                     </form>

                     </div>

                

               
              </div>
              </Link>
            </div>
          ))}
        </div>

        {/* <Link to="/home" className="btn btn-primary mt-3">Back to Home</Link> */}
      </div>
    </div>
  );
}

export default Restaurant;
