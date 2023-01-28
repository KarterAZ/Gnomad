//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Acts as the router for the application, renders
// various pages based on the one requested.
//
//################################################################

// external imports.
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// internal imports.
import HomePage from './pages/home/HomePage';
import RoutesPage from './pages/routes/RoutesPage';

// This function returns the main app content.
export default function App() 
{
  return(
    <Router>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route path='routes' element={<RoutesPage/>}/>
      </Routes>
    </Router>
  );
}
