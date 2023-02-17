//################################################################
//
// Authors: Bryce Schultz, Andrew Ramirez
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

import React, { Component, useState, useRef, useEffect } from 'react';

import GoogleMapReact from 'google-map-react';


//import h3 from 'h3-js/legacy';

// internal imports.
import { get } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'

import './map.css';

import pin from './pin.png';
import bathroom from './restroom.svg';
import fuel from './gas-station-svgrepo-com.svg';


//can later make the default lat/lng be user's location?
const defaultProps = {
  zoom: 12,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },

};

//Array of markers that gets used to populate map, eventually will be filled with pin data from database
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin },
];

//for testing marker clustering
// top left     42.26395149771135, -121.84449621695097
// bottom right 42.21184409530869, -121.75111242724213

//General format all pins will follow, made dynamic by adding image data member instead of having 3-4 separte versions 
const CustomMarker = ({ lat, lng, image }) => (
  <img
    src={image}
    alt="marker"
    style={{
      position: 'absolute', // absolute/fixed/static/sticky/relative
      width: '50px',
      height: '50px',
    }}
    lat={lat}
    lng={lng}
  />
);

export default function Map() {
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);

  //State declared for enabling/disabling marker creation on click with sidebar
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  const [cursorStyle, setCursorStyle] = useState('');

  //Function that toggles the sidebar's create pin option
  const toggleMarkerCreation = () => {
    setMarkerCreationEnabled(!markerCreationEnabled);
  };

  //Function handling onclick events on the map that will result in marker creation
  const handleCreatePin = (event) => {
    if (markerCreationEnabled) {
      setCursorStyle('./pin.png');

      //Adds marker to array that gets rendered (Eventually will have to add a pin to the database)
      setMarkers([...markers, {
        lat: event.lat,
        lng: event.lng,
        image: pin,
      }]);
    }
  };

  useEffect(() => {
    const mapElement = document.getElementById('map');
    const updateCursorStyle = () => {
      mapElement.classList.remove(cursorStyle);
      mapElement.classList.add(cursorStyle);
    };
    mapElement.addEventListener('mousemove', updateCursorStyle);
    return () => {
      mapElement.removeEventListener('mousemove', updateCursorStyle);
    };
  }, [cursorStyle]);

  //Populating presetMarkers with data from array/database
  useEffect(() => {
    async function fetchData() {
      try {
        /*If getting the following erros:
        //-----------------------------------------------------------------------
        // getting error "Failed to load resource: net::ERR_CONNECTION_REFUSED" 
        // also getting "TypeError: Failed to fetch"
        //-----------------------------------------------------------------------
        // Make sure to run backend TravelCompanionApi to fix
        //
        // Currently returns 401 unauthorized access, need to figure out how to get authorization? api.js? 
        */
        const response = await get('pins/all');
        setMarkers(response.map(marker => ({
          lat: marker.latitude,
          lng: marker.longitude,
          image: pin,
        })));
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div id='map'>
      <div id='wrapper'>
        <div id='map' className={cursorStyle}>

          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            onClick={markerCreationEnabled ? handleCreatePin : undefined}
          //className={markerCreationEnabled ? 'creating-pin' : ''}
          //onClick={handleMapClick}
          >

            {markers.map((marker, index) => ( //Renders presetMarkers on the map
              <CustomMarker
                key={index}
                lat={marker.lat}
                lng={marker.lng}
                image={marker.image}
              />
            ))}

          </GoogleMapReact>
        </div>
        <Sidebar toggleMarkerCreation={toggleMarkerCreation} />
      </div>
    </div>
  );
}