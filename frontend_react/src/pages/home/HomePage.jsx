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
import PinCreator from '../../components/pin_creator/PinCreator';
import RouteCreator from '../../components/route_creator/RouteCreator';
import Sidebar from '../../components/sidebar/Sidebar';

import './home.css';
import { useState } from 'react';
import event from '../../utilities/event';

// this function renders the home page of the application.
export default function HomePage() 
{
  const [showPinCreator, setShowPinCreator] = useState(false);
  const [showRouteCreator, setShowRouteCreator] = useState(false);

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

  event.on('show-pin-creator', () =>
  {
    setShowPinCreator(true);
  });

  event.on('close-pin-creator', () =>
  {
    setShowPinCreator(false);
  });

  event.on('show-route-creator', () =>
  {
    setShowRouteCreator(true);
  });

  event.on('close-route-creator', () =>
  {
    setShowRouteCreator(false);
  });

  return (
    <>
      <div id='content' onLoad={pageLoad}>
        <Sidebar/>
        <Map/>
        { showPinCreator && <PinCreator/> }
        { showRouteCreator && <RouteCreator/> }
      </div>
      <Routing/>
      <Directions/>
    </>
  );
}
