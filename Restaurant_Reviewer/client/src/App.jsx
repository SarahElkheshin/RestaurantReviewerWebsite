//import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home'
import User from './User'
import Restaurant from './Restaurant';
import Dashboard from './Dashboard'




function App() {
 

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/register' element={<Signup />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/home' element={<Home />}></Route>
    <Route path='/users' element={<User />}></Route> 
    <Route path='/dashboard' element={<Dashboard />}></Route> 
    <Route path='/' element={<Restaurant />}></Route>


   </Routes>
   </BrowserRouter>
  )
}

export default App
