//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Acts as the router for the application, renders
// various pages based on the one requested.
//
//################################################################

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
