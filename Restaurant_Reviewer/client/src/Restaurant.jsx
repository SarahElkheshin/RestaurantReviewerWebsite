import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';



function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurant data from your server
    axios.get('http://localhost:3001/restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const [data, setData]=useState({comment: ""})
  const handleChange=(e)=>{
    const name =e.target.name
    const value = e.target.value
    setData({...data,[name]: value})
    
  }


const handleSubmit= async(e,restaurantId)=>{ 
    e.preventDefault();
    
    var myHeaders = new Headers();
    myHeaders.append("apikey", "USkeTl8EQKqJCavRABKkLaVQ61j0R6aJ");
    
    var raw = data.comment;
    
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
          axios.put(`http://localhost:3001/restaurants/${restaurantId}/incrementNeg`
          .then(response=>{
            const updatedRestaurants = restaurants.map(restaurant => {
              if (restaurant._id === restaurantId) {
                 return { ...restaurant, TotalNegativeComments: restaurant.TotalNegativeComments + 1 };
               }
           return restaurant;
              });
              setRestaurants(updatedRestaurants);

          })
           
          )
            
        }
    
    
    })
      .catch(error => console.log('error', error));   

}


  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-75">
        <h2>Restaurant List</h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {restaurants.map((restaurant, index) => (
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
                      <textarea  name="comment" id="" className="form-control" rows="4" placeholder="Enter your comment here" onChange={handleChange} value={data.comment}/>
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
