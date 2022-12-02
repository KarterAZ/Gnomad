import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

//layout should be Layout - need Layout first though
function App() {
  return (
    <Router>
    <Routes>
        <Route exact path='/' exact element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
    </Routes>
    </Router>
  );
}

export default App;
