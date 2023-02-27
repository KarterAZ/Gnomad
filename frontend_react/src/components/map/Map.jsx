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

//import h3, { CoordPair, H3Index, geoToH3, getResolution, cellToLatLng, cellToBoundary } from 'h3-js/legacy';
//import { h3ToGeo, h3ToGeoBoundry } from "h3-reactnative";

// internal imports.
import './map.css';
//import getAll from '../../utilities/api/get_cell_data';


// internal imports.
import { get } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'


import pin from './pin.png';
import bathroom from './restroom.svg';
import fuel from './gas-station-svgrepo-com.svg';

import diesel from './gas-station-fuel-svgrepo-com.svg';
import wifi from './free-wifi-svgrepo-com.svg';
import electric from './tesla-svgrepo-com.svg';

import getH3All from '../../utilities/api/get_cell_data';


//can later make the default lat/lng be user's location?
const defaultProps = {
  zoom: 6,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
};

const handleApiLoaded = (map, maps) => {
  /*const triangleCoords = [
      { lat: 25.774, lng: -80.19 },
      { lat: 18.466, lng: -66.118 },
      { lat: 32.321, lng: -64.757 },
      { lat: 25.774, lng: -80.19 }
  ];*/

  const triangleCoords = getH3All();

  var bermudaTriangle = new maps.Polygon({
    paths: triangleCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
  bermudaTriangle.setMap(map);
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
const CustomMarker = ({ lat, lng, image, name, description, onClick }) => {

  //TODO: Custom marker is starting to get really big, consider making it into a component in it's own class?
  // such as Marker.jsx , could benefit from having it's own .css file.

  //State declared for InfoWindow displaying
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  //State declared for reputation thumbs up (1) down (-1) No selection (null)
  const [reputation, setReputation] = useState(null);

  //State declared for setting marker as a favorite true/false
  const [isFavorite, setIsFavorite] = useState(false);

  //State declared for opening reputation menu
  const [menuOpen, setMenuOpen] = useState(false);

  //Initially had an incrementer/decrementer but this version just stores one state
  //of the user, eventually needs to be connected to the database to get a finalized
  //reputation count on each marker
  const handleReputationClick = (value) => {
    if (reputation === null) {
      setReputation(value)
    }
    else {
      //if currentRep is equal to value reset reputation value to null, else assign value
      setReputation((currentReputation) =>
        currentReputation === value ? null : value
      );
    }
  };

  //Toggles statebetween true/false 
  const handleFavoriteClick = () => {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
  }

  useEffect(() => {
    //Toggles menu to close whenever the reputation useState changes (selection is made)
    setMenuOpen(false);
  }, [reputation]);

  return (
    <div>
      <img //area responsible for marker image  
        src={image}
        alt="marker"
        style={{ position: 'absolute', width: '50px', height: '50px', }}
        lat={lat}
        lng={lng}
        onClick={() => setShowInfoWindow(!showInfoWindow)}//toggles useState whether to display the InfoWindow upon marker click
      />
      {showInfoWindow && (//Customized InfoWindow, was having too much trouble using google map's 
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-60px',
            backgroundColor: 'white',
            padding: '10px',
            border: '1px solid black',
            borderRadius: '10px',
            width: '140px',
            maxWidth: '200px',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '10px' }}>{name}</div>
          <div>{description}</div>

          {/* Reputation Display */}
          <div style={{ marginBottom: '10px' }}>
            Reputation: {" "}
            {/*Conditional: if null "None" | else if 1 thumbsUp | else -1 thumbsDown */}
            {reputation === null ? "None" : reputation === "1" ? "👍" : "👎"}
          </div>

          {/* Reputation Menu*/}
          <div>
            {/* button with onClick event listener to toggle menu*/}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ position: 'absolute', top: '2px', right: '2px', }} >
              {/*Conditional: if 1 thumbsUp | else if -1 thumbsDown | else default icon*/}
              {reputation === "1" ? "👍" : reputation === "-1" ? "👎" : "📌"}
            </button>
            {menuOpen && (
              <div>
                {/*Reputation Buttons*/}
                <button // disables button if thumbsUp already selected, onClick updates useState
                  disabled={reputation == "1"}
                  onClick={() => handleReputationClick("1")}
                >
                  👍
                </button>
                <button // disables button if thumbsDown already selected, onClick updates useState
                  disabled={reputation === "-1"}
                  onClick={() => handleReputationClick("-1")}
                >
                  👎
                </button>
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <div style={{ position: 'absolute', top: '2px', left: '2px', }}>
            <button onClick={handleFavoriteClick}>
              {isFavorite ? "❤️" : "♡"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Map() {
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);

  //State declared for enabling/disabling marker creation on click with sidebar
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  const [selectedPinType, setSelectedPinType] = useState('Select Pin');

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

