import { useEffect, useState } from 'react';
import axios from 'axios';

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
    
            const response = await axios.get('http://localhost:3001/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setFavoriteRestaurants(response.data.favoriteRestaurants);
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
        <div>
            <h1>User Profile</h1>
            <div>
                <h2>Name: {userData.name}</h2>
                <p>Email: {userData.email}</p>
                <p>Phone: {userData.phone}</p>
                <button onClick={handleDeleteProfile} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete Profile'}
            </button>
            </div>
            
            <div>
                <h2>Favorite Restaurants</h2>
                <ul>
                    {favoriteRestaurants.map((restaurant) => (
                        <li key={restaurant._id}>
                            <img src={restaurant.image} alt={restaurant.name} style={{ width: '100px', height: '100px' }} />
                            <span>{restaurant.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UserProfile;
