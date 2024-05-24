import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserProfile.css';


function UserProfile() {
    const [userData, setUserData] = useState({});
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
    
            // Fetch user profile data
            const userProfileResponse = await axios.get('http://localhost:3001/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserData(userProfileResponse.data);

            // Fetch details of favorite restaurants
            const favoriteRestaurantsResponse = await Promise.all(
                userProfileResponse.data.favoriteRestaurants.map(async (restaurantId) => {
                    const response = await axios.get(`http://localhost:3001/restaurants/${restaurantId}`);
                    return response.data;
                })
            );

            setFavoriteRestaurants(favoriteRestaurantsResponse);
        } catch (error) {
            console.error('Error fetching user profile:', error.message);
        } 
    };
    
    const handleDeleteProfile = async () => {
        try {
          setDeleteLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.delete('http://localhost:3001/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            data: { email: userData.email } // Pass the email of the logged-in user
          });
          console.log(response.data);
        } catch (error) {
          console.error('Error deleting profile:', error);
        } finally {
          setDeleteLoading(false);
        }
      };
      

    return (
        <>
            <header className="header">
            <h2>Restaurant Reviewer</h2>
                <nav className="navbar">
                    <Link to="/restaurants" className="link">Home</Link>
                    <Link to="/dashboard" className="link">Dashboard</Link>
                    <Link to="/" className="link">Logout</Link>
                </nav>
            </header>

            <div className='wrapper'>
                <div className="profile-container">
                    <div className='user-card'>
                        <div className='user-card-img'>
                            <img src='./src/assets/girl.jpg' alt="Avatar" />
                        </div>
                        <div className='user-card-info'>
                            <h2>{userData.name}</h2>
                            <p><span>Email:</span> {userData.email}</p>
                            <p><span>Phone:</span> {userData.phone}</p>
                             <button onClick={handleDeleteProfile} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Update Profile'}
                           </button>
                             <button onClick={handleDeleteProfile} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Delete Profile'}
                            </button>
                            
                        </div>
                    </div>
                </div>
                <div className="favorite-restaurants">
                    {favoriteRestaurants.map((restaurant) => (
                        <div key={restaurant._id} className="restaurant-card">
                            <img src={restaurant.image} alt={restaurant.name} />
                            <h3>{restaurant.name}</h3>
                            <p>Type: {restaurant.type}</p>
                            <p>District: {restaurant.district}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
    
}

export default UserProfile;