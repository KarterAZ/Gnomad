//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The home page component.
//
//################################################################

// internal imports.
import Routing from '../../components/routing_info/routing';
import Directions from '../../components/directions/directions';
import Map from '../../components/map/Map';
import { hasLocalData, loadRoutes } from '../../utilities/offline_data/offline_data';

import './home.css';

// this function renders the home page of the application.
export default function HomePage() 
{
  const pageLoad = () =>
  {
    loadUserData();
  }

  const loadUserData = () =>
  {
    if (hasLocalData())
    {
      let local_routes = loadRoutes();
      if (local_routes !== undefined)
      {
        
      }
    }
  }

  return (
    <>
      <div id='content' onLoad={pageLoad}>
        <Map/>
      </div>
      <Routing/>
      <Directions/>
    </>
  );
}
