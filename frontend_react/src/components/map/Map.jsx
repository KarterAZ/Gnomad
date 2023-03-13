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


// internal imports.
import './map.css';


// internal imports.
import { get, isAuthenticated } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'


import pin from './pin.png';
import bathroom from './restroom.svg';
import fuel from './gas-station-svgrepo-com.svg';

import diesel from './gas-station-fuel-svgrepo-com.svg';
import wifi from './free-wifi-svgrepo-com.svg';
import electric from './tesla-svgrepo-com.svg';

import getAllCoords from '../../utilities/api/get_cell_coords';

//can later make the default lat/lng be user's location?
const defaultProps = {
  zoom: 6,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
};

const handleApiLoaded = async(map, maps) => {
    var colorNum = 0;
    var color = ["#FF5733", "#FFFC33", "#33FF36", "#33FFF9", "#3393FF", "#3339FF", "#9F33FF", "#FF33CA", "#FF3333", "#440000"]
    var bermudaTriangles = [];

    for (let i = 0; i < 242; i++) {
        var latLngArray = [];
        var lngArray = await getAllCoords(i);

        for (let ii = 0; ii < lngArray.length; ii += 2) {
            let gData = new maps.LatLng(parseFloat(lngArray[ii]), parseFloat(lngArray[ii + 1]));
            latLngArray.push(gData);
        }
        var bermudaTriangle = new maps.Polygon({
            paths: latLngArray,
            strokeColor: color[colorNum],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color[colorNum],
            fillOpacity: 0.35
        });
        bermudaTriangles.push(bermudaTriangle);

        bermudaTriangles[i].setMap(map);
        colorNum = (colorNum % 10) + 1;
    }
}

//Array of markers that gets used to populate map, eventually will be filled with pin data from database
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom, name: "Restroom", description: " Brevada" },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel, name: "Gas Station", description: "Pilot" },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin, name: "Pin", description: "Oregon Tech" },
  { lat: 42.256846864827104, lng: -121.78922109474301, image: electric, name: "Supercharger", description: "Oregon Tech Parking Lot F" },
  { lat: 42.25609775858464, lng: -121.78464735517863, image: wifi, name: "Free Wifi", description: "College Union Guest Wifi" },
];

//General format all pins will follow, made dynamic by adding image data member instead of having 3-4 separte versions 
const CustomMarker = ({ lat, lng, image, name, description, onClick }) => (
  <img
    src={image}
    alt="marker"
    style={{
      position: 'absolute', // absolute/fixed/static/sticky/relative
      width: '50px',
      height: '50px',
    }}

    title={`${name} - ${description}`}
    lat={lat}
    lng={lng}
    onClick={onClick}
  />

);

export default function Map() {
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);

  //State declared for enabling/disabling marker creation on click with sidebar
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  const [selectedPinType, setSelectedPinType] = useState('Select Pin');

  // const [cursorStyle, setCursorStyle] = useState('');

  //Function that toggles the sidebar's create pin option
  const toggleMarkerCreation = (pinType) => {
    setMarkerCreationEnabled(!markerCreationEnabled);
    setSelectedPinType(pinType);
  };

  //Function handling onclick events on the map that will result in marker creation
  const handleCreatePin = (event) => {

    if (markerCreationEnabled && selectedPinType) {
      let pinImage = '';
      switch (selectedPinType) {
        case 'pin':
          pinImage = pin;
          break;
        case 'bathroom':
          pinImage = bathroom;
          break;
        case 'fuel':
          pinImage = fuel;
          break;
        case 'wifi':
          pinImage = wifi;
          break;
        case 'electric':
          pinImage = electric;
          break;
        case 'diesel':
          pinImage = diesel;
          break;
      }


      //Adds marker to array that gets rendered (Eventually will have to add a pin to the database)
      setMarkers([...markers, {
        lat: event.lat,
        lng: event.lng,
        image: pinImage,
        name: selectedPinType,
        description: 'placeholder text',
      }]);
      setMarkerCreationEnabled(false);
      setSelectedPinType('Select Pin');

    }
  };

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
        <div id='map' >
        <Sidebar toggleMarkerCreation={toggleMarkerCreation} />

          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
            defaultCenter={defaultProps.center}
                      defaultZoom={defaultProps.zoom}
                  yesIWantToUseGoogleMapApiInternals //this is important!
                  onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            onClick={markerCreationEnabled ? handleCreatePin : undefined}

          >

            {markers.map((marker, index) => ( //Renders presetMarkers on the map
              <CustomMarker
                key={index}
                lat={marker.lat}
                lng={marker.lng}
                name={marker.name}
                description={marker.description}
                image={marker.image}
              //onClick={() => handleMarkerClick(marker)}

              />
            ))}

          </GoogleMapReact>
        </div >

      </div>
    </div>
  );
}



/** TODO: have a googlemaps infowindow display upon click of a pin
 //usestate that will be used to keep track of infowindows

 const [selectedMarker, setSelectedMarker] = useState(null);

 const InfoWindow = ({ marker, onClose }) => (
  <div style={{ position: 'absolute', zIndex: 100, backgroundColor: 'white', padding: 10 }}>
    <h3>{marker.name}</h3>
    <p>{marker.description}</p>
    <button onClick={onClose}>Close</button>
  </div>
);
//Some usestate handlers to use
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

 */


/** TODO: Change cursor image upon selection of sidebar pin
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
  */
  //Populating presetMarkers with data from array/database

