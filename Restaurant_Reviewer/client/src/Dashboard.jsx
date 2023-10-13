import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
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


    return(

<main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={breakfastData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                     <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" fontSize={10}/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TotalPositiveComments" fill="#8884d8"   />
                <Bar dataKey="TotalNeutralComments" fill="#ff7f7f"   />
                <Bar dataKey="TotalNegativeComments" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={lunchData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" fontSize={10} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="TotalPositiveComments" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="TotalNeutralComments" stroke="#82ca9d" />
                <Line type="monotone" dataKey="TotalNegativeComments" stroke="#ff7f7f" />
                </LineChart>
            </ResponsiveContainer>


            <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dinnerData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-25} textAnchor="end" fontSize={10} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TotalPositiveComments" stackId="sentiment" fill="#8884d8" />
          <Bar dataKey="TotalNeutralComments" stackId="sentiment" fill="#82ca9d" />
          <Bar dataKey="TotalNegativeComments" stackId="sentiment" fill="#ff7f7f" />
        </BarChart>
      </ResponsiveContainer>
            </div>
    </main>


    )
}
export default Dashboard