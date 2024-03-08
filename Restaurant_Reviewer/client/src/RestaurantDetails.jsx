// RestaurantDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
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
  <header className="page-header">
    <div className="content">
      <h2>{restaurant.name}</h2>
    </div>
  </header>
  <aside className="page-rightbar">
    <div className="content">
    <ul>
          {feedbacks.map(feedback => (
            <li key={feedback._id} className="feedback-box">
              {feedback.comment}
            </li>
          ))}
        </ul>
    </div>
  </aside>
  <main className="page-main">
    <div className="content">
        <p>Category: {restaurant.category}</p>
        <p>Type: {restaurant.type}</p>
        <p>District: {restaurant.district}</p>
        <p>Total Positive Comments: {restaurant.TotalPositiveComments}</p>
        <p>Total Neutral Comments: {restaurant.TotalNeutralComments}</p>
        <p>Total Negative Comments: {restaurant.TotalNegativeComments}</p>

    </div>
  </main>
  <footer className="page-footer">
    <div className="content">
      <p>Footer</p>
    </div>
  </footer>
</div>
  );
}


RestaurantDetails.propTypes = {
  // If you have any prop types, you can define them here
};

export default RestaurantDetails;
