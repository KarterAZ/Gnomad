//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

import React, { Component, useState, useRef, useEffect } from 'react';

import GoogleMapReact from 'google-map-react';

// internal imports.
import './map.css';
import './markers.css';
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

const CustomMarker = ({ lat, lng }) => (
  <img src={pin} alt="pin" style={{
    position: 'absolute',
    width: '50px',
    height: '50px',

  }}
    lat={lat}
    lng={lng}
  />
);

const FuelMarker = ({ lat, lng }) => (
  <img src={fuel} alt="fuel" style={{
    position: 'relative',
    transform: `translate(${-20 / 2}px,${-40}px)`,
    width: '80px',
    height: '70px',

  }}
    lat={lat}
    lng={lng}
  />
);

const BathroomMarker = ({ lat, lng }) => (
  <img src={bathroom} alt="bathroom" style={{
    position: 'fixed',
    //transform: `translate(${-20 / 2}px,${-40}px)`,
    width: '80px',
    height: '70px',
    text: "Sample Text",
    position: 'relative',
  }}
    lat={lat}
    lng={lng}
  />
);



export default function Map() {

  const [markers, setMarkers] = useState([
    {
      lat: 42.255,
      lng: -121.7855,
      icon: './pin.png',
    },
  ]);

  const handleMapClick = (event) => {
    setMarkers([...markers, { lat: event.lat, lng: event.lng }]);
  };


  return (
    <div id='map'>
      <div id='wrapper'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <CustomMarker
              key={index}
              lat={marker.lat}
              lng={marker.lng}
            />
          ))}

        </GoogleMapReact>
      </div>
    </div>
  );
}

/** Fixed testing markers
 * 
 * 
          <CustomMarker
            lat={42.255}
            lng={-121.7855}
            text="Oregon Tech"
          />
          <BathroomMarker
            lat={42.922}
            lng={-121.7855}
            text="Oregon Tech"
          />
          <FuelMarker
            lat={42.255}
            lng={-12.7855}
            text="Oregon Tech"
          />

 */