import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Restaurant.css';
import SearchBar from './SearchBar';



function Restaurant({ userId }) { // Corrected the way props are destructured
  const [restaurants, setRestaurants] = useState([]);
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [district, setDistrict] = useState('all');
  const [comments, setComments] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {

    
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    if (!token) {
      // Handle case where user is not authenticated
      console.error('User is not authenticated');
      return;
    }
  
    // Fetch the user's profile with authentication token
    axios.get('http://localhost:3001/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        // Assuming the response contains the user's name
        setUserName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        // Handle error (e.g., redirect to login page)
      });



// Fetch restaurants based on filter criteria
    axios.get('http://localhost:3001/restaurants', {
      params: {
        category,
        type,
        district,
        sortOption,
        sortOrder,
      },
    })
      .then(response => {
        setRestaurants(response.data);
        const initialComments = response.data.reduce((acc, restaurant) => {
          acc[restaurant._id] = "";
          return acc;
        }, {});
        setComments(initialComments);
      })
      .catch(error => {
        console.error(error);
      });
  }, [category, type, district, sortOption, sortOrder, searchTerm]); // Added searchTerm to dependencies

  const handleChange = (e, restaurantId) => {
    const value = e.target.value;
    setComments({
      ...comments,
      [restaurantId]: value,
    });
  };

  const handleSubmit = async (e, restaurantId) => {
    e.preventDefault();
    const commentText = comments[restaurantId];

    setComments({
      ...comments,
      [restaurantId]: "",
    });

    try {
      const response = await axios.post('http://localhost:3001/feedbacks', {
        restaurantId,
        comment: commentText,
      });

      setFeedbacks({
        ...feedbacks,
        [response.data._id]: response.data,
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText }),
    };

    fetch("http://127.0.0.1:5000/predict-sentiment", requestOptions)
      .then(response => response.json())
      .then(data => {
        const sentiment = data.sentiment;
        console.log(sentiment)
        let updateEndpoint = '';

        if (sentiment === 'positive') {
          updateEndpoint = `increment`;
        } else if (sentiment === 'negative') {
          updateEndpoint = `incrementNeg`;
        } else if (sentiment === 'neutral') {
          updateEndpoint = `incrementNeutral`;
        }

        if (updateEndpoint) {
          axios.put(`http://localhost:3001/restaurants/${restaurantId}/${updateEndpoint}`)
            .then(response => {
              const updatedRestaurants = restaurants.map(restaurant => {
                if (restaurant._id === restaurantId) {
                  const key = `Total${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}Comments`;
                  return { ...restaurant, [key]: restaurant[key] + 1 };
                }
                return restaurant;
              });
              setRestaurants(updatedRestaurants);
            })
            .catch(error => {
              console.error('Error updating restaurant:', error);
            });
        }
      })
      .catch(error => console.log('error', error));
  };

  const handleSortChange = (e) => {
    const value = e.target.value.split('-');
    setSortOption(value[0]);
    setSortOrder(value[1]);
  };

  const filteredRestaurants = restaurants
    .filter(restaurant => (category === 'all' || restaurant.category === category))
    .filter(restaurant => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddToFavorite = async (restaurantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        'http://localhost:3001/users/favorites/add',
        { restaurantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavoriteRestaurants(prevFavoriteRestaurants => [...prevFavoriteRestaurants, restaurantId]);
      console.log('Restaurant added to favorites:', response.data);
    } catch (error) {
      console.error('Error adding restaurant to favorites:', error);
      if (error.response && error.response.status === 403) {
        console.error('You do not have permission to perform this action.');
      }
    }
  };
    

  return (
    <div className="d-flex flex-column align-items-center bg-custom vh-100" id="12">
      <div className="bg-customfront p-3 rounded">
        <img className="logo" src='./src/assets/logo.png' alt="Logo" />
        <h2 className="heading">Restaurant Reviewer</h2>
        <div className="topnav">
          <Link to="/home" className="active">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <div className='rightnav'>
            <Link to="/profile">Hi, {userName}</Link>
            <Link to="/">Logout</Link>
            </div>
          
        </div>

        <div className="SearchBar">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="selection-container">
          <div className="category-selection">
            <label htmlFor="category">Category:</label>
            <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div className="type-selection">
            <label htmlFor="type">Type:</label>
            <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)} >
              <option value="all">All</option>
              <option value="fine dining">Fine Dining</option>
              <option value="burger">Burger</option>
              <option value="fast food">Fast Food</option>
              <option value="pastries">Pastries</option>
            </select>
          </div>

          <div className="district-selection">
            <label htmlFor="district">District:</label>
            <select id="district" name="district" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="all">All</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="sort-selection">
            <label htmlFor="sort">Sort By:</label>
            <select id="sort" name="sort" value={`${sortOption}-${sortOrder}`} onChange={handleSortChange}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="TotalPositiveComments-asc">Positive Comments (Low to High)</option>
              <option value="TotalPositiveComments-desc">Positive Comments (High to Low)</option>
            </select>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-4 g-4">
          {filteredRestaurants.map((restaurant, index) => (
            <div key={index} className="col">
              <div className="card">
                <img className="card-img" src={restaurant.image} alt={restaurant.name} />
{/* Star icon */}
<div className="favourite-icon">
              <button onClick={() => handleAddToFavorite(restaurant._id)}>
                <img src="./src/assets/heart-icon.png" alt="Favourite" />
              </button>
            </div>

                <div className="card-body">
                  <Link to={`/restaurant/${restaurant._id}`} style={{ textDecoration: 'none' }}>
                    <h5 className="card-title">{restaurant.name}</h5>
                  </Link>
                  <div id="design-cast">
                    <div className="member">
                      <img src='./src/assets/positive.png' className="img-responsive img-thumbnail emoji" alt="Positive" />
                    </div>
                    <div className="name">{restaurant.TotalPositiveComments}</div>
                    <div className="member">
                      <img src='./src/assets/neutral.png' className="img-responsive img-thumbnail emoji" alt="Neutral" />
                    </div>
                    <div className="name">{restaurant.TotalNeutralComments}</div>
                    <div className="member">
                      <img src='./src/assets/negative.png' className="img-thumbnail emoji" alt="Negative" />
                    </div>
                    <div className="name">{restaurant.TotalNegativeComments}</div>
                  </div>
                  <form method="post" onSubmit={(e) => handleSubmit(e, restaurant._id)}>
                    <textarea name="comment" className="card-textarea" rows="2" placeholder="Enter your comment here" onChange={(e) => handleChange(e, restaurant._id)} value={comments[restaurant._id]} />
                    <button type="submit" className="btn-primary" id="submit-button">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
