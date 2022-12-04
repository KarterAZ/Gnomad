import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';

//layout should be Layout - need Layout first though
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
