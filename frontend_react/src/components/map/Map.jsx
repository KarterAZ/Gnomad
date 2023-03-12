//################################################################
//
// Authors: Bryce Schultz, Andrew Ramirez
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

//import h3 from 'h3-js/legacy';

//import h3, { CoordPair, H3Index, geoToH3, getResolution, cellToLatLng, cellToBoundary } from 'h3-js/legacy';
//import { h3ToGeo, h3ToGeoBoundry } from "h3-reactnative";

// internal imports.
import './map.css';


// internal imports.
import { get } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'


import pin from '../../images/Pin.png';
import bathroom from '../../images/Restroom.png';
import fuel from '../../images/Gas.png';

import diesel from '../../images/Diesel.png';
import wifi from '../../images/WiFi.png';
import electric from '../../images/Charger.png';

//import getH3All from '../../utilities/api/get_cell_data';


//can later make the default lat/lng be user's location?
const defaultProps = 
{
  zoom: 6,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
};

/*const handleApiLoaded = (map, maps) => 
{
  const triangleCoords = [
      { lat: 25.774, lng: -80.19 },
      { lat: 18.466, lng: -66.118 },
      { lat: 32.321, lng: -64.757 },
      { lat: 25.774, lng: -80.19 }
  ];

  const triangleCoords = getH3All();

  var bermudaTriangle = new maps.Polygon(
    {
      paths: triangleCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    }
  );

  bermudaTriangle.setMap(map);
}*/

//Array of markers that gets used to populate map, eventually will be filled with pin data from database
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom, type: "Restroom", description: " Brevada" },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel, type: "Gas Station", description: "Pilot" },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin, type: "Pin", description: "Oregon Tech" },
  { lat: 42.256846864827104, lng: -121.78922109474301, image: electric, type: "Supercharger", description: "Oregon Tech Parking Lot F" },
  { lat: 42.25609775858464, lng: -121.78464735517863, image: wifi, type: "Free Wifi", description: "College Union Guest Wifi" },
];

//General format all pins will follow, made dynamic by adding image data member instead of having 3-4 separate versions 
const CustomMarker = ({ lat, lng, image, type, name, description, onClick }) => 
{
  const THUMBS_UP = "1";
  const THUMBS_DOWN = "-1";
  //TODO: Custom marker is starting to get really big, consider making it into a component in it's own class?
  // such as Marker.jsx , could benefit from having it's own .css file.

  //State declared for InfoWindow displaying
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  //State declared for reputation thumbs up (1) down (-1) No selection (null)
  const [reputation, setReputation] = useState(null);

  //State declared for setting marker as a favorite true/false
  const [isFavorite, setIsFavorite] = useState(false);

  //Initially had an incrementer/decrementer but this version just stores one state
  //of the user, eventually needs to be connected to the database to get a finalized
  //reputation count on each marker
  const handleReputationClick = (value) => 
  {
    if (reputation === null) 
    {
      setReputation(value)
    } 
    else 
    {
      //if currentRep is equal to value reset reputation value to null, else assign value
      setReputation((currentReputation) =>
        currentReputation === value ? null : value
      );
    }
  };

  //Toggles state between true/false 
  const handleFavoriteClick = () => 
  {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
  }

  return (
    <div className='marker-container'>
      <img //area responsible for marker image  
        className='marker'
        src={image}
        alt="marker"
        lat={lat}
        lng={lng}
        onClick={() => setShowInfoWindow(!showInfoWindow)}//toggles useState whether to display the InfoWindow upon marker click
      />
      {showInfoWindow && (//Customized InfoWindow, was having too much trouble using google map's 
        <div className='info-window'>
          <div className='info-window-header'>
            {/* Favorite Button */}
            <div className='header-button-wrapper'>
              <button className='header-button' onClick={handleFavoriteClick}>
                {isFavorite ? "❤️" : "🖤"}
              </button>
            </div>

            <div className='pin-title'>{type}</div>

            <div className='header-button-wrapper'>
              <button
                className='header-button'
                disabled={reputation === THUMBS_UP}
                onClick={() => handleReputationClick(THUMBS_UP)}
              >
                👍
              </button>
              <button
                className='header-button'
                disabled={reputation === THUMBS_DOWN}
                onClick={() => handleReputationClick(THUMBS_DOWN)}
              >
                👎
              </button>
            </div>
          </div>
          
          <div className='info-window-body'>
            <div>{name}</div>
            <div>{description}</div>
          </div>

          <div className='info-window-reputation'>
            <div style={{ marginBottom: '10px' }}>
              Reputation: {" "}
              {/*Conditional: if null "None" | else if 1 thumbsUp | else -1 thumbsDown */}
              {reputation === null ? "None" : reputation === THUMBS_UP ? "👍" : "👎"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Map() 
{
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);

  //State declared for enabling/disabling marker creation on click with sidebar
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  const [selectedPinName, setSelectedPinName] = useState("");
  const [selectedPinDescription, setSelectedPinDescription] = useState("");
  const [selectedPinType, setSelectedPinType] = useState("");

  //Function that toggles the sidebar's create pin option
  const toggleMarkerCreation = (pinName, pinDescription, pinType) => 
  {
    setMarkerCreationEnabled(!markerCreationEnabled);
    setSelectedPinName(pinName);
    setSelectedPinDescription(pinDescription);
    setSelectedPinType(pinType);
  };

  //Function handling onclick events on the map that will result in marker creation
  const handleCreatePin = (event) => 
  {
    if (markerCreationEnabled && selectedPinType !== "") 
    {
      let pinImage = '';
      switch (selectedPinType) 
      {
        case 'Pin':
          pinImage = pin;
          break;
        case 'Bathroom':
          pinImage = bathroom;
          break;
        case 'Fuel':
          pinImage = fuel;
          break;
        case 'Wi-Fi':
          pinImage = wifi;
          break;
        case 'Supercharger':
          pinImage = electric;
          break;
        case 'Diesel':
          pinImage = diesel;
          break;
        default:
          pinImage = pin;
      }

      //Adds marker to array that gets rendered (Eventually will have to add a pin to the database)
      setMarkers([...markers, 
      {
        lat: event.lat,
        lng: event.lng,
        image: pinImage,
        type: selectedPinType,
        name: selectedPinName,
        description: selectedPinDescription,
      }]);
      setMarkerCreationEnabled(false);
    }
  };

  useEffect(() => 
  {
    async function fetchData() 
    {
      try 
      {
        /*If getting the following errors:
        //-----------------------------------------------------------------------
        // getting error "Failed to load resource: net::ERR_CONNECTION_REFUSED" 
        // also getting "TypeError: Failed to fetch"
        //-----------------------------------------------------------------------
        // Make sure to run backend TravelCompanionApi to fix
        //
        // Currently returns 401 unauthorized access, need to figure out how to get authorization? api.js? 
        */
        const response = await get('pins/all');
        setMarkers(response.map(marker => (
        {
          lat: marker.latitude,
          lng: marker.longitude,
          image: pin,
        })));
      } 
      catch (error) 
      {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
      <div id='wrapper'>
        <Sidebar toggleMarkerCreation={toggleMarkerCreation} />
        <div id='map'>
          <GoogleMapReact
            draggable={!markerCreationEnabled}
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
                type={marker.type}
                name={marker.name}
                description={marker.description}
                image={marker.image}
              />
            ))}

          </GoogleMapReact>
        </div >
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

