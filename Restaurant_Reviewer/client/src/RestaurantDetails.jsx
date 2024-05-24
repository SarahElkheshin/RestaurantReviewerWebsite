// RestaurantDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './RestaurantDetails.css';

function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantResponse = await axios.get(`http://localhost:3001/restaurants/${id}`);
        setRestaurant(restaurantResponse.data);

        const feedbackResponse = await axios.get(`http://localhost:3001/feedbacks?restaurantId=${id}`);
        setFeedbacks(feedbackResponse.data);
        console.log(feedbackResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  return (
    <div className="grid">
      <header className="header">
        <h2>Restaurant Reviewer</h2>
        <nav className="navbar">
          <Link to="/restaurants" className="link">Home</Link>
          <Link to="/dashboard" className="link">Dashboard</Link>
          <Link to="/" className="link">Logout</Link>
        </nav>
      </header>
  
      <main className="profile-container">
        <div className='user-card'>
          <div className='user-card-img'>
            <img src={restaurant.image} alt={restaurant.name} />
          </div>
          <div className='user-card-info'>
            <h2>{restaurant.name}</h2>
            <p><span>Category:</span> {restaurant.category}</p>
            <p><span>Type:</span> {restaurant.type}</p>
            <p><span>District:</span> {restaurant.district}</p>
            <p><span>Total Positive Comments:</span> {restaurant.TotalPositiveComments}</p>
            <p><span>Total Neutral Comments:</span> {restaurant.TotalNeutralComments}</p>
            <p><span>Total Negative Comments:</span> {restaurant.TotalNegativeComments}</p>
          </div>
        </div>
      </main>
  
      <aside className="page-rightbar">
        <div className="flexbox">
          <div className="item">
            {feedbacks.map(feedback => (
              <p key={feedback._id} className="feedback-text">
                {feedback.comment}
              </p>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
  
  
  

}

export default RestaurantDetails;
