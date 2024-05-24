
import { useState , useEffect} from 'react';
import axios from 'axios';

function User() {
  const [users] = useState([]);

  useEffect(() => {
    // Fetch employee data from an API endpoint (replace with your API endpoint)
    axios.get('http://localhost:3001/users')
      .then(response => {
      //  setEmployees(response.data); // Assuming the response contains an array of employee objects
        console.log(response)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>Name:</strong> {user.name}<br />
            <strong>Email:</strong> {user.email}<br />
            {/* Add more employee details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default User;