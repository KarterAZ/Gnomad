//################################################################
//
// Authors: Bryce Schultz, Andrew Ramirez
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, MarkerClusterer, DirectionsService, Polygon, InfoWindow } from '@react-google-maps/api';

// internal imports.
import './map.css';


// internal imports.
import { get, isAuthenticated } from '../../utilities/api/api.js';
import createPin from '../../utilities/api/create_pin';
import Pin from '../../data/pin';
import { ratePin, getPinRating, cancelVote } from '../../utilities/api/rating';

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

//marker cluster options
const options = {
  imagePath:
    '../../images/Pin.png',
}

const polyOptions = {
  fillColor: "lightblue",
  fillOpacity: 1,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

// array of markers that gets used to populate map, eventually will be filled with pin data from database.
//used to test marker operations/google maps without having to render entire
const presetMarkers = [
  { id: 0, lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom, type: "Restroom", name: "Brevada" },
  { id: 0, lat: 42.25850950074424, lng: -121.79943326457828, image: fuel, type: "Gas Station", name: "Pilot" },
  { id: 0, lat: 42.25644490904306, lng: -121.7859578463942, image: pin, type: "Pin", name: "Oregon Tech" },
  { id: 0, lat: 42.256846864827104, lng: -121.78922109474301, image: electric, type: "Supercharger", name: "Oregon Tech Parking Lot F" },
  { id: 0, lat: 42.25609775858464, lng: -121.78464735517863, image: wifi, type: "Free Wifi", name: "College Union Guest Wifi" },

  { id: 0, lat: 42.216694982977884, lng: -121.7335159821316, image: pin, type: "Pin", name: "testing" }, //extra added to test markercluster
];

// can still utilize our own infowindow, dont need to use google map's, realistically most of this code is just for infowindow
// renamed and repurposed.
const MyInfoWindow = ({ marker }) => {
  // named constants for the rating values.
  const THUMBS_UP = "1";
  const THUMBS_DOWN = "-1";

  // TODO: custom marker is starting to get really big, consider making it into a component in it's own class?
  // such as Marker.jsx , could benefit from having it's own .css file.

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

  const setRating = async (rating) =>
  {
    const response = await ratePin(marker.id, rating);

    if (response == null)
    {
      console.log('Set vote failed.');
    }
    else
    {
      getRating();
    }
  }

  async function getRating()
  {
    const response = await getPinRating(marker.id);

    if (response == null)
    {
      console.log('Failed to get pin rating.');
    }
    else
    {
      setReputation(response);
    }
  }

  // on load call get rating.
  useEffect(() => 
  {
    getRating();
  }, []);

  // toggles favorite state between true/false on click. 
  const handleFavoriteClick = () => {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
  }

  return (
    <div className='info-window' >
      <div className='info-window-header'>
        {/* favorite button */}
        <div className='header-button-wrapper'>
          <button className='header-button' onClick={handleFavoriteClick}>
            {isFavorite ? "❤️" : "🖤"}
          </button>
        </div>

        {/* show pin type as the title */}
        <div className='pin-title'>{marker.type}</div>

        {/* header with reputation */}
        <div className='header-button-wrapper'>
          <button
            className='header-button'
            onClick={() => setRating(THUMBS_UP)}
          >
            👍
          </button>
          <button
            className='header-button'
            onClick={() => setRating(THUMBS_DOWN)}
          >
            👎
          </button>
        </div>
      </div>
      {/* show name and description */}
      <div className='info-window-body'>
        <div>{marker.name}</div>
      </div>

      <div className='info-window-reputation'>
        <div style={{ marginBottom: '10px' }}>
          Rating: {'⭐'.repeat(reputation)}
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

const Map = () => {
  const map_ref = useRef();
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);
  const [overlayPolygons, setOverlayPolygons] = useState([]);

  // state declared for enabling/disabling marker creation on click with sidebar.
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  //States declared for Pin Names, Descriptions, and Types.
  const [pinToCreate, setPinToCreate] = useState({});

  //States for getting onclick interactions with google maps markers & our custom infowindow
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  //const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    // create a pin on the event.
    event.on('create-pin', (data) => {
      // allow on click to place a marker.
      setMarkerCreationEnabled(true);
      setPinToCreate({ name: data.pin.name, type: data.pin.type });
    });

    //Events for cellular overlay
    event.on('toggle-cellular-creator-on', () => {
      if (overlayPolygons.length == 0) {
        getPolygons();
      }
      else {
        console.log(overlayPolygons);
        setOverlayPolygons([])
      }
    });

    event.on('toggle-cellular-creator-off', () => {
      setOverlayPolygons([])
    });
  }, []);

  // function handling onclick events on the map that will result in marker creation.
  const handleCreatePin = async (event) => {
    if (markerCreationEnabled && pinToCreate.type !== "") {
      // disable marker creation to prevent double calling.
      setMarkerCreationEnabled(false);

      // some shorter variables.
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const type = pinToCreate.type;
      const name = pinToCreate.name;

      let pinImage = '';
      switch (type) {
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
        lat: lat,
        lng: lng,
        image: pinImage,
        type: type,
        name: name,
      }

      setMarkers([...markers,
        marker
      ]);

       // create the pin object.
       let new_pin = new Pin(0, 0, lng, lat, name, '', []);
       // call backend function to add pin to database.
       const response = await createPin(new_pin);
 
       if (response == null)
       {
         console.log('Could not create pin in database.');
       }
    }
  };

  // handles changes to lat/lng depending on position and zoom
  const handleMapChange = async () => {
    const map = map_ref.current.state.map;

    const map_bounds = map.getBounds();

    const bounds =
    {
      latMin: map_bounds.Ua.lo,
      latMax: map_bounds.Ua.hi,
      lngMin: map_bounds.Ha.lo,
      lngMax: map_bounds.Ha.hi
    }

    fetchData(bounds.latMin, bounds.lngMin, bounds.latMax, bounds.lngMax);
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
            break;
          default:
            imageType = pin;
            break;
        }
        return {
          id: marker.id,
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

  const reloadPoly = () => {
    var container = document.getElementById("mypoly");
    var content = container.innerHTML;
    container.innerHTML = content;
  }

  const getPolygons = async () => {
    //variables for the bounds of the screen
    const map = map_ref.current.state.map;

    const map_bounds = map.getBounds();
    const map_zoom = map.getZoom();
    const map_center = map.getCenter();

    const bounds =
    {
      latMin: map_bounds.Ua.lo,
      latMax: map_bounds.Ua.hi,
      lngMin: map_bounds.Ha.lo,
      lngMax: map_bounds.Ha.hi
    }

    const map_state =
    {
      bounds: bounds,
      zoom: map_zoom,
      center: map_center
    };

    //Number of threads for backend
    let maxNum = 5;

    const zoom_threshold = 11;

    // only get the cellular data if the zoom is high enough.
    if (map_state.zoom > zoom_threshold) {
      // calls all the async functions and waits for all of them to return.
      let retArrays = await getAllCoords(maxNum, map_state.bounds.latMin, map_state.bounds.lngMin, map_state.bounds.latMax, map_state.bounds.lngMax);
      console.log(retArrays);
      //parse all the coords to api lat/lng
      var latLngArray = [];
      for (let i = 0; i < retArrays.length; i += 2) {
        //let gData = new window.google.maps.LatLng(parseFloat(retArrays[i]), parseFloat(retArrays[i + 1]));
        //latLngArray.push(gData);
        latLngArray.push({ lat: parseFloat(retArrays[i]), lng: parseFloat(retArrays[i + 1]) });
      }
      console.log(latLngArray);
      setOverlayPolygons(latLngArray);
    }
    else {
      //Alert user to zoom in more
      alert("Please zoom in more to access cellular data :)");
      event.emit('cancel-cellular-overlay');
    }
  }
  const StatusWindow = ({ text }) => {
    return (
      <div class='status-window'>
        <p>{text}</p>
      </div>
    );
  }

  const mapOptions =
  {
    fullscreenControl: false,
    mapTypeControl: false
  };

  return (
    <div id='wrapper'>
      {
        markerCreationEnabled &&
        <StatusWindow text="Click to place the marker." />
      }
      <div id='map'>
        <LoadScript googleMapsApiKey="AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o">
          <GoogleMap
            ref={map_ref}
            className='map'
            options={mapOptions}
            mapContainerStyle={containerStyle}
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            draggable={!markerCreationEnabled}
            //yesIWantToUseGoogleMapApiInternals //Please, for the love of god, stop deleting this
            //onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            onClick={markerCreationEnabled ? handleCreatePin : undefined}
            onDragEnd={handleMapChange}
          >
            <Polygon
              editable={true}
              paths={overlayPolygons}
              options={polyOptions}
            />
            <MarkerClusterer options={{ maxZoom: 14 }}>
              {(clusterer) =>
                markers.map((marker, index) =>
                (
                  //...markers, removsed for meantime
                  // TODO: caledSize: new window. .maps.Size(50, 50), uses hard fixed pixels,
                  // tried a few different ways to get screen size and scale it to a % of it but breaks  
                  <Marker
                    icon=
                    {{
                      // url works? path: doesnt?
                      url: marker.image,
                      scaledSize: new window.google.maps.Size(56, 60),
                    }}

                    key={index}
                    position=
                    {{
                      lat: marker.lat,
                      lng: marker.lng
                    }}

                    onClick={() => {
                      setSelectedMarker(marker);
                      setShowInfoWindow(true);
                    }}
                    clusterer={clusterer} // Add the clusterer prop to each marker
                  >
                  </Marker>
                ))
              }
            </MarkerClusterer>
            {
              showInfoWindow && 
              <InfoWindow
                position=
                {{
                  lat: selectedMarker.lat,
                  lng: selectedMarker.lng
                }}

                onCloseClick={() => setShowInfoWindow(false)}
              >
                <MyInfoWindow marker={selectedMarker}/>
              </InfoWindow>
            }
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
/*
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
                      )}*/