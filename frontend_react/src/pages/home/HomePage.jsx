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

import './home.css';
import { useState } from 'react';
import event from '../../utilities/event';

// this function renders the home page of the application.
export default function HomePage() 
{
  const [showPinCreator, setShowPinCreator] = useState(false);
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

  return (
    <>
      <div id='content' onLoad={pageLoad}>
        <Map/>
        { showPinCreator && <PinCreator/> }
      </div>
      <Routing/>
      <Directions/>
    </>
  );
}
