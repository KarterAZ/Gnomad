//################################################################
//
// Authors: Bryce Schultz, Andrew Ramirez
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################


import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  MarkerClusterer,
  DirectionsService,
  DirectionsRenderer,
  Polygon,
  InfoWindow
} from '@react-google-maps/api';
import DOMPurify from 'dompurify';


// internal imports.
import './map.css';

import event from '../../utilities/event';
import pin from '../../images/Pin.png';
import bathroom from '../../images/Restroom.png';
import fuel from '../../images/Gas.png';
import diesel from '../../images/Diesel.png';
import wifi from '../../images/WiFi.png';
import electric from '../../images/Charger.png';

//apis
import getRoutes from '../../utilities/api/get_routes';
import { get } from '../../utilities/api/api.js';
import createPin from '../../utilities/api/create_pin';
import { ratePin, getPinRating, cancelVote, haveVoted, getVote } from '../../utilities/api/rating';
import Pin from '../../data/pin';
import getAllCoords from '../../utilities/api/get_cell_coords';

//Compoennts
import Sidebar from '../sidebar/Sidebar';
import DirectionsPanel from '../directions/directions';
import RouteCreator from '../route_creator/RouteCreator'


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
  fillOpacity: .25,
  strokeColor: "blue",
  strokeOpacity: .25,
  strokeWeight: .5,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

// array of markers that gets used to populate map, eventually will be filled with pin data from database.
//used to test marker operations/google maps without having to render entire
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom, type: "Restroom", name: "Brevada", pinTag: 2 },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel, type: "Gas Station", name: "Pilot", pinTag: 5 },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin, type: "Pin", name: "Oregon Tech" , pinTag: 2},
  { lat: 42.256846864827104, lng: -121.78922109474301, image: electric, type: "Supercharger", name: "Oregon Tech Parking Lot F", pinTag: 3 },
  { lat: 42.25609775858464, lng: -121.78464735517863, image: wifi, type: "Free Wifi", name: "College Union Guest Wifi", pinTag: 8 },

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

  const [votedup, setUpVote] = useState(false);

  const [voteddown, setDownVote] = useState(false);

  // state declared for setting marker as a favorite true/false.
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => 
  {
    checkUserVote();
  }, []);

  const checkUserVote = async () => {
    const pinId = marker.id;
    const hasVoted = await haveVoted(pinId);
  
    if (hasVoted) {
      const vote = await getVote(pinId);
      if (vote === 1) {
        setUpVote(true);
        setDownVote(false);
      } else if (vote === -1) {
        setUpVote(false);
        setDownVote(true);
      } else {
        setUpVote(false);
        setDownVote(false);
      }
    } else {
      setUpVote(false);
      setDownVote(false);
    }
  };

  const setRating = async (rating) => 
{
  const pinId = marker.id;
  console.log('pinId:', pinId);

  try 
    {
    const hasVoted = await haveVoted(pinId);
    console.log('hasVoted:', hasVoted);

    if (hasVoted) 
    {
      const response = await cancelVote(pinId);
      console.log('cancelVote response:', response);

      if (response == null) 
      {
        console.log('Cancel vote failed.');
      } 
      else 
      {
        getRating();
        checkUserVote();
        console.log('Rating updated successfully.');
      }
    } 
    else 
    {
      const response = await ratePin(pinId, rating);
      console.log('ratePin response:', response);

      if (response == null) 
      {
        console.log('Set vote failed.');
      } 
      else 
      {
        getRating();
        checkUserVote();
        console.log('Rating updated successfully.');
      }
    }
  } 
  catch (error) 
  {
    console.log('Error:', error);
  }
};


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
  useEffect(() => {
    getRating();
    checkUserVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className={`header-button ${votedup ? 'voted' : ''}`}
          onClick={() => setRating(THUMBS_UP)}
        >
          {votedup ? "👍🏼" : "👍"}
          </button>
        <button
          className={`header-button ${votedup ? 'voted' : ''}`}
          onClick={() => setRating(THUMBS_DOWN)}
          >
            {voteddown ? "👎🏼" : "👎"}
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


const Map = ({ excludedArr }) => {
  const map_ref = useRef();

  //testing directionsrender given array of unknown size with presetmarkers
  //origin being the first,
  //desitination being the last,
  //waypoints being everything inbetween




  //State declared for storing markers
  const [markers, setMarkers] = useState([]);
  const [overlayPolygons, setOverlayPolygons] = useState([]);

  // state declared for enabling/disabling marker creation on click with sidebar.
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  //States declared for Pin Names, Descriptions, and Types.
  const [pinToCreate, setPinToCreate] = useState({});

  //States for getting onclick interactions with google maps markers & our custom infowindow
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  //States for direction rendering

  const [directions, setDirections] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsMarkers, setDirectionsMarkers] = useState([]);

  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [waypoints, setWaypoints] = useState([]);

  //State for communicating with directions render
  const [showDirections, setShowDirections] = useState(false); // toggle true or false to show directions 


  useEffect(() => {
    // create a pin on the event.
    event.on('create-pin', (data) => {
      // allow on click to place a marker.
      setMarkerCreationEnabled(true);
      setPinToCreate({ name: data.pin.name, type: data.pin.type });
    });

    //Events for cellular overlay
    event.on('toggle-cellular-creator-on', () => {
      if (overlayPolygons.length === 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps

    event.on('draw-route', (data) => {
      fetchRoute(data.id);

     console.log("clicked");
     console.log(data);
     
     setShowDirections(true);
     
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

      const type_map =
      {
        'Pin': 0,
        'Bathroom': 1,
        'Supercharger': 3,
        'Fuel': 4,
        'Diesel': 5,
        'Wi-Fi': 7
      }

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

      // create the pin object.
      let new_pin = new Pin(0, 0, lng, lat, name, '', [type_map[type]]);
      // call backend function to add pin to database.
      const response = await createPin(new_pin);

      if (response == null) {
        console.log('Could not create pin in database.');
      }
      else {
        handleMapChange();
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

  const fetchRoute = async (selectedID) => {
    try {
      //Grab all routes 
      let response = await getRoutes();
      //console.log("Response ", response);
      //filter by selected route ID depending on onClick event from search      
      const selectedRoute = response.filter(route => route.id === selectedID);
      //console.log("Selected Route ",selectedRoute[0].pins);
      setDirectionsMarkers(selectedRoute[0].pins);
      //console.log(selectedRoute[0].pins);

      const origin = directionsMarkers.length > 0 ? {
        lat: directionsMarkers[0].latitude,
        lng: directionsMarkers[0].longitude
      } : null;
      
      setOrigin(origin)

      const destination = directionsMarkers.length > 0 ? {
        lat: directionsMarkers[directionsMarkers.length - 1].latitude,
        lng: directionsMarkers[directionsMarkers.length - 1].longitude
      } : null;

      setDestination(destination);

      const waypoints = directionsMarkers.slice(1, -1).map(marker => ({
        location: { lat: marker.latitude, lng: marker.longitude },
        stopover: true
      }));
      setWaypoints(waypoints);
    }
    catch (error) {
      console.error(error);
    }
  }

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
    const fetchData = async (latStart, longStart, latRange, longRange) => {
      try {
        const response = await get(`pins/getAllInArea?latStart=${latStart}&longStart=${longStart}&latRange=${latRange}&longRange=${longRange}`);
        let imageType;
        // adjusts marker imageType depending on json response .
        const markers = response.map(marker => { //TEMPORARILY CHANGED response.map to presetMarkers.map for TESTING
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
            pinTag: marker.tags[0],
          };
        });
        console.log(excludedArr);
        console.log('Bathroom: ', pin);
        //markers = markers.filter(marker => !excludedArr.includes(marker.pinType));
        setMarkers(markers.filter(marker => !excludedArr.includes(marker.image)));

      } catch (error) {
        console.error(error);
      }
    }


    const position =
    {
      lat: 37.772,
      lng: -122.214
    }

    function onDirectionsFetched(directions) {
      //console.log(directions);
      if (directions !== null) {
        const steps = directions.routes[0].legs[0].steps;
        const directionsPanelContent = steps.map(step => {
          const sanitizedInstructions = DOMPurify.sanitize(step.html_instructions, { ALLOWED_TAGS: [] });
          return `<p>${sanitizedInstructions}</p>`;
        }).join('');
        setDirections(directions);
      }
    }

    const handleCloseDirections = () => {
      setShowDirections(false);
      //setDirections(null);
      setOrigin(null);
      setDestination(null);
      setWaypoints(null);
    };


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
        var overArray = [];
        var sep = 1;
        for (let i = 0; i < retArrays.length; i += 2) {
          //let gData = new window.google.maps.LatLng(parseFloat(retArrays[i]), parseFloat(retArrays[i + 1]));
          //latLngArray.push(gData);
          latLngArray.push({ lat: parseFloat(retArrays[i]), lng: parseFloat(retArrays[i + 1]) });
          if (sep % 6 === 0) {
            latLngArray.push({ lat: parseFloat(retArrays[i - 10]), lng: parseFloat(retArrays[i - 9]) });
            overArray.push(latLngArray);
            latLngArray = [];
          }
          sep++;
        }
        //console.log(latLngArray);
        setOverlayPolygons(overArray);
      }
      else {
        //Alert user to zoom in more
        alert("Please zoom in more to access cellular data :)");
        event.emit('cancel-cellular-overlay');
      }
    }
    const StatusWindow = ({ text }) => {
      return (
        <div className='status-window'>
          <p>{text}</p>
        </div>
      );
    }

  const mapOptions =
  {
    fullscreenControl: false
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

              defaultOptions={{ mapTypeControl: false }}

              ref={map_ref}
              className='map'
              options={mapOptions}

              mapContainerStyle={containerStyle}
              center={defaultProps.center}
              zoom={defaultProps.zoom}
              draggable={!markerCreationEnabled}

              onGoogleApiLoaded={({ map, maps }) => {
                console.log("Google Maps API loaded successfully!");
                console.log("Map object:", map);
                console.log("Maps object:", maps);
                setDirectionsService(new maps.DirectionsService());
              }}
              //onCenterChanged={fetchRoute(31)}// test for routes
              onClick={markerCreationEnabled ? handleCreatePin : undefined}
              onDragEnd={handleMapChange}
            >
              <Polygon
                editable={true}
                paths={overlayPolygons}
                options={polyOptions}
              />

              {showDirections && (
                <DirectionsService
                  options={{
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints,
                    travelMode: 'DRIVING',
                  }}
                  callback={onDirectionsFetched}
                />
              )}
              
              {showDirections && (
                <DirectionsRenderer
                  options={{
                    directions: directions,
                    polylineOptions: {
                      strokeColor: "#000",
                    },
                    panel: document.getElementById('directions-panel'),
                    //suppressMarkers: true,
                      
                  }}
                />
              )}
              {showDirections && <DirectionsPanel directions={directions} onClose={handleCloseDirections} />}

              <MarkerClusterer options={{ maxZoom: 14 }}>
                {(clusterer) =>
                  [...markers, ...presetMarkers].map((marker, index) =>
                  (
                    //...markers, removsed for meantime
                    // TODO: caledSize: new window. .maps.Size(50, 50), uses hard fixed pixels,
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
                    </Marker>
                  ))
                }
              </MarkerClusterer>
            </GoogleMap>
          </LoadScript>
        </div>
      </div >
    );
  };
  export default React.memo(Map);