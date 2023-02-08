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
import { MarkerClusterer } from "@googlemaps/markerclusterer";


// internal imports.
import './map.css';
import './markers.css';
import pin from './pin.png';
import bathroom from './restroom.svg';
import fuel from './gas-station-svgrepo-com.svg';
import Sidebar from '../sidebar/Sidebar.jsx';

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

  //Function that toggles the sidebar's create pin option
  const toggleMarkerCreation = () => {
    setMarkerCreationEnabled(!markerCreationEnabled);
  };

  //Function handling onclick events on the map that will result in marker creation
  const handleMapClick = (event) => {
    //Adds marker to array that gets rendered (Eventually will have to add a pin to the database)
    setMarkers([...markers, {
      lat: event.lat,
      lng: event.lng,
      image: pin,
    }]);
  };

  //Populating presetMarkers with data from array/database
  useEffect(() => {
    fetch('') // api endpoint will go here (having trouble running backend at the moment)
      .then(response => response.json())
      .then(data => setMarkers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div id='map'>
      <div id='wrapper'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onClick={handleMapClick}
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
    </div>
  );
}