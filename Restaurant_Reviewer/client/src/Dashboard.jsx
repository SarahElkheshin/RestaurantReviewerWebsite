import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
 import 
 { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';

 function Dashboard() {
  const [data, setData] = useState([]);
  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/restaurants');
        
        // Filter the data to include only restaurants with the "dinner" category
        const all = response.data.map(({ image, ...rest }) => rest);
        setData(all);

        const breakfast = response.data.filter(restaurant => restaurant.category === "breakfast").map(({ image, ...rest }) => rest);
        setBreakfastData(breakfast);

        const lunch = response.data.filter(restaurant => restaurant.category === "lunch").map(({ image, ...rest }) => rest);
        setLunchData(lunch);

        const dinner = response.data.filter(restaurant => restaurant.category === "dinner").map(({ image, ...rest }) => rest);
        setDinnerData(dinner);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Call the async function
  }, []);


  return (

    <main className='main-container'>

      <div className="topnav">
        <Link to="/restaurants">Home</Link>
        <Link to="/dashboard" className="active">Dashboard</Link>
        <div className="topnav-right-dashboard">
          <Link to="/">Logout</Link>
        </div>
      </div>

      <div className='main-title'>
        <h3>Overal Sentiment Analysis</h3>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={breakfastData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" fontSize={10} />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ position: 'relative' }} />
            <Bar dataKey="TotalPositiveComments" fill="#a3de83" />
            <Bar dataKey="TotalNeutralComments" fill="#ffe121" />
            <Bar dataKey="TotalNegativeComments" fill="#fa4659" />
            <text x="50%" y="13" textAnchor="middle" fontSize="16" fontWeight="bold">
              Breakfast Category Breakdown
            </text>
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lunchData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" fontSize={10} />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ position: 'relative' }} />
            <Line type="monotone" dataKey="TotalPositiveComments" stroke="#a3de83" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="TotalNeutralComments" stroke="#ffe121" />
            <Line type="monotone" dataKey="TotalNegativeComments" stroke="#fa4659" />
            <text x="50%" y="13" textAnchor="middle" fontSize="16" fontWeight="bold">
              Lunch Category Breakdown
            </text>
          </LineChart>
        </ResponsiveContainer>


        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dinnerData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" fontSize={10} />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ position: 'relative' }} />
            <Bar dataKey="TotalPositiveComments" stackId="sentiment" fill="#a3de83" />
            <Bar dataKey="TotalNeutralComments" stackId="sentiment" fill="#ffe121" />
            <Bar dataKey="TotalNegativeComments" stackId="sentiment" fill="#fa4659" />
            <text x="50%" y="13" textAnchor="middle" fontSize="16" fontWeight="bold">
              Dinner Category Breakdown
            </text>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>


  )
}
export default Dashboard