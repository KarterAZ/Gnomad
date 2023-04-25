//################################################################
//
// Authors: Bryce Schultz, Andrew Ramirez
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, MarkerClusterer, DirectionsService } from '@react-google-maps/api';

// internal imports.
import './map.css';


// internal imports.
import { get, isAuthenticated } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'


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

//marker cluster options
const options = {
  imagePath:
    '../../images/Pin.png',
}




// fills in the cell coverage.
const handleApiLoaded = async (map, maps) => {
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


// array of markers that gets used to populate map, eventually will be filled with pin data from database.
//used to test marker operations/google maps without having to render entire
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom, type: "Restroom", description: "Brevada" },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel, type: "Gas Station", description: "Pilot" },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin, type: "Pin", description: "Oregon Tech" },
  { lat: 42.256846864827104, lng: -121.78922109474301, image: electric, type: "Supercharger", description: "Oregon Tech Parking Lot F" },
  { lat: 42.25609775858464, lng: -121.78464735517863, image: wifi, type: "Free Wifi", description: "College Union Guest Wifi" },

  { lat: 42.216694982977884, lng: -121.7335159821316, image: pin, type: "Pin", description: "testing" }, //extra added to test markercluster




];

// can still utilize our own infowindow, dont need to use google map's, realistically most of this code is just for infowindow
// renamed and repurposed.
const MyInfoWindow = ({ lat, lng, type, name, description, toggleWindow }) => {
  // named constants for the rating values.
  const THUMBS_UP = "1";
  const THUMBS_DOWN = "-1";

  // TODO: custom marker is starting to get really big, consider making it into a component in it's own class?
  // such as Marker.jsx , could benefit from having it's own .css file.

  // state declared for InfoWindow displaying.
  const [showInfoWindow, setShowInfoWindow] = useState(toggleWindow);

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
  //REQUIRED TO FORMAT LIKE THIS
  // or else it will not load from lat/lng, needs position 

  const position = {
    lat: lat,
    lng: lng,
  }
 
  return (
    <div className='infowindow-container' >
    
      {showInfoWindow && (
        // customized InfoWindow, was having too much trouble using google map's (plus ours looks nicer).
        <div className='info-window' >
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

const center = {
  lat: -3.745,
  lng: -38.523
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

const Map = () => {
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);

  // state declared for enabling/disabling marker creation on click with sidebar.
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  //States declared for Pin Names, Descriptions, and Types.
  const [selectedPinName, setSelectedPinName] = useState("");
  const [selectedPinDescription, setSelectedPinDescription] = useState("");
  const [selectedPinType, setSelectedPinType] = useState("");

  //States for getting onclick interactions with google maps markers & our custom infowindow
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  //const [directionsResponse, setDirectionsResponse] = useState(null);


  // function that toggles the sidebar's create pin option.
  const toggleMarkerCreation = (pinName, pinDescription, pinType) => {
    setMarkerCreationEnabled(!markerCreationEnabled);
    setSelectedPinName(pinName);
    setSelectedPinDescription(pinDescription);
    setSelectedPinType(pinType);
  };

  // function handling onclick events on the map that will result in marker creation.
  const handleCreatePin = (event) => {
    console.log(event);

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

      //Adds marker to array that gets rendered (TODO: Eventually will have to add a pin to the database)
      let marker =
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        image: pinImage,
        type: selectedPinType,
        name: selectedPinName,
        description: selectedPinDescription,

      }

      setMarkers([...markers,
        marker
      ]);

      console.log(marker);
      setMarkerCreationEnabled(false);
    }
  };

  // handles changes to lat/lng depending on position and zoom
  const handleMapChange = ({ center, zoom, bounds }) => {
    //extract lat/lng out of bounds & center
    const { lat, lng } = center;
    const { lat: latStart, lng: longStart } = bounds.sw;
    //calculating range of lat/lng
    const latRange = bounds.ne.lat - bounds.sw.lat;
    const longRange = bounds.ne.lng - bounds.sw.lng;

    console.log(lat, lng, latRange, longRange);
    fetchData(lat, lng, latRange, longRange);

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

      setMarkers(markers);

    } catch (error) {
      console.error(error);
    }
  }

  const position = {
    lat: 37.772,
    lng: -122.214
  }
  console.log(markers);

  return (
    <div id='wrapper'>
      <Sidebar toggleMarkerCreation={toggleMarkerCreation} />
      <div id='map'>
        <LoadScript googleMapsApiKey="AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            draggable={!markerCreationEnabled}

            onGoogleApiLoaded={({ map, maps }) => {
              console.log("Google Maps API loaded successfully!");
              console.log("Map object:", map);
              console.log("Maps object:", maps);
              handleApiLoaded(map, maps)
            }}

            onClick={markerCreationEnabled ? handleCreatePin : undefined}
            onChange={handleMapChange}
          >
            <MarkerClusterer options={{ maxZoom: 14 }}>
              {(clusterer) =>
                [...markers,...presetMarkers].map((marker, index) =>
                (
                  //...markers, removsed for meantime
                  // TODO: caledSize: new window. .maps.Size(50, 50), uses hard fixed pixels,
                  // tried a few different ways to get screen size and scale it to a % of it but breaks  
                  <Marker
                    icon=
                    {{
                      // url works? path: doesnt?
                      url: marker.image,
                      scaledSize: new window.google.maps.Size(60, 60),
                    }}
                    key={index}
                    position=
                    {{
                      lat: marker.lat,
                      lng: marker.lng
                    }}
                    onClick={() => {
                      setSelectedMarker(marker);
                      console.log(selectedMarker); //is returning correct marker
                      setShowInfoWindow(!showInfoWindow);
                      console.log(showInfoWindow);
                    }}
                    clusterer={clusterer} // Add the clusterer prop to each marker
                  >
                    {selectedMarker && showInfoWindow &&
                      (
                        <MyInfoWindow
                          lat={selectedMarker.lat}
                          lng={selectedMarker.lng}
                          type={selectedMarker.type}
                          name={selectedMarker.name}
                          description={selectedMarker.description}
                          toggleWindow={showInfoWindow}
                        >
                        </MyInfoWindow>
                      )}
                  </Marker>
                ))
              }
            </MarkerClusterer>
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};
export default React.memo(Map);


/* Need to integrate callback functions, can put this snippet between the 
// MarkerCluster and Googlemap component on the bottom once done
  <DirectionsService
      options=
      {{
          origin: { lat: presetMarkers[0].lat, lng: presetMarkers[0].lng },
          destination: { lat: presetMarkers[5].lat, lng: presetMarkers[5].lng },
          travelMode: 'DRIVING',
      }}
          callback={(result) => 
          {
            if (result !== null)
            {
              setDirectionsResponse(result); 
            }
          }}
    />
*/