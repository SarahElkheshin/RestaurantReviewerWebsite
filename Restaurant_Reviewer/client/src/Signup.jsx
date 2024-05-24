import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import './Signup.css'



function Signup()
{
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [phone,setPhone]=useState()
    const navigate = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/register', {name, email,password,phone})
        .then(result => {console.log(result)
        navigate('/login')
     })
    
        .catch(err=>console.log(err))
    }
 
    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="register-title">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name"><b>Name</b></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="email"><b>Email</b></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password"><b>Password</b></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="phone"><b>Phone</b></label>
                        <input
                            type="text"
                            placeholder="Enter Phone"
                            autoComplete="off"
                            name="name"
                            onChange={(e) => setPhone(e.target.value)}
                        />

                    <button type="submit">Register</button>
                    </div>
                </form>
                <p>Already have an account</p>
                <div className="form-container">
                    <Link to="/login" className="login-btn">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;