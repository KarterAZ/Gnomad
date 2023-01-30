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

export default function Map() {

  const defaultProps = {
    zoom: 12,
    center: {
      lat: 42.2565,
      lng: -121.78,
    },
    
  };

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
   
    /*
    const[markers,setMarkers]=React.useState([]);
    React.useEffect(() => {
      const map = document.getElementById('map').childNodes[0].childNodes[0]._googleMapComponent.map;
      GoogleMapReact.maps.event.addListener(map, 'click', (event) => {
        setMarkers(current => [...current, {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }]);
      });
    }, []);
    **/
    return (
    <div id='map'>
    <div id='wrapper'>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker
              lat={42.255}
              lng={-121.7855}
              text="Oregon Tech"
            />
        
      </GoogleMapReact>
    </div>
  </div>
  );
}

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
