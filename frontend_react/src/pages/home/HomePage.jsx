//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The home page component.
//
//################################################################

// internal imports.
import Sidebar from '../../components/sidebar/Sidebar';
import Routing from '../../components/routing_info/routing';
import Directions from '../../components/directions/directions';
import Map from '../../components/map/Map';

import './home.css';

// this function renders the home page of the application.
export default function HomePage() 
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
