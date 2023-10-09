import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} 
 from 'recharts';

function Dashboard() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/restaurants');
            const updatedData = response.data.map(({image, ...rest }) => rest);
            setData(updatedData);
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
            data={data}
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
                <Bar dataKey="TotalNegativeComments" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
            </div>
    </main>


    )
}
export default Dashboard