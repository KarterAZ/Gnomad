//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The home page component.
//
//################################################################

import Sidebar from '../../components/sidebar/Sidebar';
import Routing from '../../components/routing_info/routing';
import Directions from '../../components/directions/directions';
import Map from '../../components/map/Map';

import './home.css';

function Home() 
{
  return (
    <>
      <div id='content'>
        <Sidebar/>
        <Map/>
      </div>
      <Routing/>
      <Directions/>
    </>
  );
}

export default Home;
