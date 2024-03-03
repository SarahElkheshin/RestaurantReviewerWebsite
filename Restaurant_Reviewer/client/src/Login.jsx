import { useState } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import'./Login.css'
function Login(){

    const [email, setEmail]=useState()
    const [password, setPassword]=useState()
    const navigate = useNavigate()
axios.defaults.withCredentials = true;
    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/login', {email,password})
        .then(result => {
            console.log(result)
            if(result.data ===   "Success") {     
                navigate('/')
            }
     })
    
        .catch(err=>console.log(err))
    }

    return (
        <div className="login-container">
            <div className="login-box">
               
                <form onSubmit={handleSubmit}>
                    <div className="img-container">
                        <img src="./src/assets/avatar.png" alt="Avatar" className="avatar" />
                    </div>
                    <h2 className="login-title">Login</h2>
                    <div className="form-container">
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

                        <button type="submit">Login</button>
                    </div>
                </form>
                <p>Do not have an account</p>
                <div className="form-container">
                    <Link to="/register" className="register-btn">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;