import React from 'react';
import './App.css';
import Home from './pages/home/Home';
import Layout from './/layout-pages/Shared/_Layout.cshtml'

//layout should be Layout - need Layout first though
function App() {
  return (
    <Layout>
      <Home/>
    </Layout>
  );
}

export default App;
