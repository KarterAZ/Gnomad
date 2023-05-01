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

// internal imports.
import './map.css';


// internal imports.
import { get, isAuthenticated } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'

import event from '../../utilities/event';
import pin from '../../images/Pin.png';
import bathroom from '../../images/Restroom.png';
import fuel from '../../images/Gas.png';

import diesel from '../../images/Diesel.png';
import wifi from '../../images/WiFi.png';
import electric from '../../images/Charger.png';


import getAllCoords from '../../utilities/api/get_cell_coords';

// can later make the default lat/lng be user's location?
const defaultProps =
{
  zoom: 6,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
};

// fills in the cell coverage.
const handleApiLoaded = async (map, maps) => {

  //variables for the bounds of the screen
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  //fill an array of calls to the backend
  // const promises = [];
  let maxNum = 5;
  // for(let i = 0; i < maxNum; i++)
  // {
  //   promises.push(getAllCoords(maxNum, i, ne.lat(), ne.lng(), sw.lat(), sw.lng()));
  // }

  //calls all the async functions and waits for all of them to return
  let retArrays = getAllCoords(maxNum, ne.lat(), ne.lng(), sw.lat(), sw.lng());

  //parse all the coords to api lat/lng
  var latLngArray = [];
  for (let i = 0; i < retArrays.length; i += 2) {
    let gData = new maps.LatLng(parseFloat(retArrays[i]), parseFloat(retArrays[i + 1]));
    latLngArray.push(gData);
  }

  //draw the map
  var bermudaTriangle = new maps.Polygon({
    paths: latLngArray,
    strokeColor: "#3393FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#3393FF",
    fillOpacity: 0.35
  });
  bermudaTriangle.setMap(map);
}


// array of markers that gets used to populate map, eventually will be filled with pin data from database.
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom, type: "Restroom", description: "Brevada" },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel, type: "Gas Station", description: "Pilot" },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin, type: "Pin", description: "Oregon Tech" },
  { lat: 42.256846864827104, lng: -121.78922109474301, image: electric, type: "Supercharger", description: "Oregon Tech Parking Lot F" },
  { lat: 42.25609775858464, lng: -121.78464735517863, image: wifi, type: "Free Wifi", description: "College Union Guest Wifi" },
];

// general format all pins will follow, made dynamic by adding image data member instead of having 3-4 separate versions.
const CustomMarker = ({ lat, lng, image, type, name, description, onClick }) => {
  // named constants for the rating values.
  const THUMBS_UP = "1";
  const THUMBS_DOWN = "-1";

  // TODO: custom marker is starting to get really big, consider making it into a component in it's own class?
  // such as Marker.jsx , could benefit from having it's own .css file.

  // state declared for InfoWindow displaying.
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  // state declared for reputation thumbs up (1) down (-1) No selection (null).
  const [reputation, setReputation] = useState(null);

  // state declared for setting marker as a favorite true/false.
  const [isFavorite, setIsFavorite] = useState(false);

  // initially had an incrementer/decrementer but this version just stores one state
  // of the user, eventually needs to be connected to the database to get a finalized
  // reputation count on each marker.
  const handleReputationClick = (value) => {
    if (reputation === null) {
      setReputation(value)
    }
    else {
      // if currentRep is equal to value reset reputation value to null, else assign value.
      setReputation((currentReputation) =>
        currentReputation === value ? null : value
      );
    }
  };

  // toggles favorite state between true/false on click. 
  const handleFavoriteClick = () => {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
  }

  return (
    <div className='marker-container'>
      <img // area responsible for marker image. 
        className='marker'
        src={image}
        alt="marker"
        lat={lat}
        lng={lng}
        onClick={() => setShowInfoWindow(!showInfoWindow)}
      // toggles useState whether to display the InfoWindow upon marker click.
      />
      {showInfoWindow && (
        // customized InfoWindow, was having too much trouble using google map's (plus ours looks nicer).
        <div className='info-window'>
          <div className='info-window-header'>
            {/* favorite button */}
            <div className='header-button-wrapper'>
              <button className='header-button' onClick={handleFavoriteClick}>
                {isFavorite ? "❤️" : "🖤"}
              </button>
            </div>

            {/* show pin type as the title */}
            <div className='pin-title'>{type}</div>

            {/* header with reputation */}
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
          {/* show name and description */}
          <div className='info-window-body'>
            <div>{name}</div>
            <div>{description}</div>
          </div>

          <div className='info-window-reputation'>
            <div style={{ marginBottom: '10px' }}>
              Reputation: {" "}
              {/* conditional: if null "None" | else if 1 thumbsUp | else -1 thumbsDown */}
              {reputation === null ? "None" : reputation === THUMBS_UP ? "👍" : "👎"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Map() {
  // state declared for storing markers.
  const [markers, setMarkers] = useState([]);

  // state declared for enabling/disabling marker creation on click with sidebar.
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  const [selectedPinName, setSelectedPinName] = useState("");
  const [selectedPinDescription, setSelectedPinDescription] = useState("");
  const [selectedPinType, setSelectedPinType] = useState("");

  // function that toggles the sidebar's create pin option.
  const toggleMarkerCreation = (pinName, pinDescription, pinType) => {
    setMarkerCreationEnabled(!markerCreationEnabled);
    setSelectedPinName(pinName);
    setSelectedPinDescription(pinDescription);
    setSelectedPinType(pinType);
  };

  event.on('create-pin', (data) => {
    toggleMarkerCreation(data.pin.name, data.pin.description, data.pin.type)
  });

  // function handling onclick events on the map that will result in marker creation.
  const handleCreatePin = (event) => {
    if (markerCreationEnabled && selectedPinType !== "") {
      let pinImage = '';
      switch (selectedPinType) {
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

      // adds marker to array that gets rendered (Eventually will have to add a pin to the database).
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

  // handles changes to lat/lng depending on position and zoom
  const handleMapChange = async ({ center, zoom, bounds }) => {
    //extract lat/lng out of bounds & center
    let { lat, lng } = center;
    const { lat: latStart, lng: lngStart } = bounds.sw;

    // set lng to a valid coordinate
    lng = ((lng + 180) % 360 + 360) % 360 - 180;

    // set the ranges
    const latRange = bounds.ne.lat - bounds.sw.lat;
    const longRange = bounds.ne.lng - bounds.sw.lng;

    console.log('Lat:', lat);
    console.log('Lng:', lng);
    fetchData(lat, lng, latRange, longRange);

    // Remove markers that are not within the current bounds
    /*
     for (let i = 0; i < markers.length; i++) {
       const marker = markers[i];
       if ((marker.lat < latStart ||
         marker.lat > latStart + latRange ||
         marker.lng < longStart ||
         marker.lng > longStart + longRange)) {
         // Remove the marker from the map and from the markers array
         marker.setMap(null); // setMap not a function? Maybe in other react google api? 
         markers.splice(i, 1);
         i--;
       }
     }
    */
  };

  /* If getting the error:
  // -----------------------------------------------------------------------
  //  getting error "Failed to load resource: net::ERR_CONNECTION_REFUSED" 
  // -----------------------------------------------------------------------
  // Make sure to run backend TravelCompanionApi to fix
  // TODO: Update switch statement to separate between customer/free wifi/bathroom when marker resources finalized
  // TODO: always goes to the default option, fix tag reading from DB.
  */

  //Blueprint for filtering through pins, can add elements in sidebar later
  //TODO: Make excludedPinTypes dynamic when sidebar has pin filtering. Currently used to reduce severe clutter.
  const excludedPinTypes = [3, 4, 8]; // array of pin types to exclude.


  const fetchData = async (latStart, longStart, latRange, longRange) => {
    try {
      const response = await get(`pins/getAllInArea?latStart=${latStart}&longStart=${longStart}&latRange=${latRange}&longRange=${longRange}`);
      let imageType;
      // adjusts marker imageType depending on json response .
      const markers = response.map(marker => {
        switch (marker.tags[0]) {
          case 1:
          case 2:
            imageType = bathroom;
            break;
          case 3:
            imageType = electric;
            break;
          case 4:
            imageType = fuel;
            break;
          case 5:
            imageType = diesel;
            break;
          case 7:
          case 8:
            imageType = wifi;
          default:
            imageType = pin;
            break;
        }
        return {
          lat: marker.latitude,
          lng: marker.longitude,
          image: imageType,
          type: marker.title,
          street: marker.street,

        };
      });
      // TODO: fix this function and remove debugging statement below.
      console.log(markers);
      setMarkers(markers);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div id='wrapper'>
      <Sidebar toggleMarkerCreation={toggleMarkerCreation} />
      <div id='map'>
        <GoogleMapReact
          draggable={!markerCreationEnabled}
          bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals //this is important!
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          onClick={markerCreationEnabled ? handleCreatePin : undefined}
          onChange={handleMapChange}
        >


          {[...markers, ...presetMarkers].map((marker, index) => (//Renders presetMarkers on the map
            <CustomMarker
              key={index}
              lat={marker.lat}
              lng={marker.lng}
              type={marker.type}
              name={marker.name}
              description={marker.description}
              street={marker.street}
              image={marker.image}
            />
          ))}

        </GoogleMapReact>
      </div >
    </div>
  );
}
/* TODO: Change cursor image upon selection of sidebar pin
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

