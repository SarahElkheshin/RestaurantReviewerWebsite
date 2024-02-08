// RestaurantDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Bar } from 'recharts';

function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant , setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/restaurants/${id}`)
      .then(response => {
        setRestaurant(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Comments',
        data: [
          restaurant.TotalPositiveComments,
          restaurant.TotalNeutralComments,
          restaurant.TotalNegativeComments,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>{restaurant.name} Details</h1>
      <div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default RestaurantDetails;
