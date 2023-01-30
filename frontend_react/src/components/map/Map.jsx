//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

import React, { Component, useState, useRef, useEffect } from 'react';
import {
  GoogleMapsProvider,
  useGoogleMap,
} from "@ubilabs/google-maps-react-hooks";

// internal imports.
import './map.css';
import './markers.css';
import pin from './pin.png';


const defaultProps = {
  zoom: 12,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
  
};

/** 
const Marker = ({ lat, lng }) => (

  <img src={pin} alt="pin" style={{
    position: 'absolute',
    transform: `translate(${-20 / 2}px,${-40}px)`,
    width: '80px',
    height: '70px',
    text: "Sample Text",

  }}
    lat={lat}
    lng={lng}
  />
);
*/


export default function Map() {
  const [mapContainer, setMapContainer] = useState(null);

  return (
    <GoogleMapsProvider
      googleMapsAPIKey={'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o'}
      options={defaultProps}
      mapContainer={mapContainer}
    >
      <div ref={(node) => setMapContainer(node)} style={{ height: "100vh", width: "100%",}} />
      
    </GoogleMapsProvider>
  );
}

/** 
function Location() {
  const [lat, setLat] = useState(43.68);
  const [lng, setLng] = useState(-79.43);
  const { map } = useGoogleMap();
  const markerRef = useRef();

  useEffect(() => {
    if (!map || markerRef.current) return;
    markerRef.current = new window.google.maps.Marker({ map });
  }, [map]);

  useEffect(() => {
    if (!markerRef.current) return;
    if (isNaN(lat) || isNaN(lng)) return;
    markerRef.current.setPosition({ lat, lng });
    map.panTo({ lat, lng });
  }, [lat, lng, map]);

  return (
    <div className="lat-lng">
      <input
        type="number"
        value={lat}
        onChange={(event) => setLat(parseFloat(event.target.value))}
        step={0.01}
      />
      <input
        type="number"
        value={lng}
        onChange={(event) => setLng(parseFloat(event.target.value))}
        step={0.01}
      />
    </div>
  );
}
*/
//Rough mockup of what we can do for varying pin images, modified from an example 

/** const Pin = ({  pin }) => {
    const pinName = pin.NAME;
    const pinType = pinMap[pinName];

    function handleMarkerClick(){
       console.log('marker clicked');
    }

    const pinImage = pinImageMap[pinType];
    return (
        <div onClick={handleMarkerClick}>
            {
              // Render pinImage image 
            }
            <img src={pinImage} alt="Logo" />
        </div>
    );
};*/
