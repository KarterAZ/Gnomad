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
import { get, isAuthenticated } from '../../utilities/api/api.js';
import Sidebar from '../sidebar/Sidebar'


import pin from './pin.png';
import bathroom from './restroom.svg';
import fuel from './gas-station-svgrepo-com.svg';

import diesel from './gas-station-fuel-svgrepo-com.svg';
import wifi from './free-wifi-svgrepo-com.svg';
import electric from './tesla-svgrepo-com.svg';

import getLatAll from '../../utilities/api/get_cell_Lat';
import getLngAll from '../../utilities/api/get_cell_Lng';


//can later make the default lat/lng be user's location?
const defaultProps = {
  zoom: 6,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
};

const handleApiLoaded = async(map, maps) => {
    /*const triangleCoords = [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 }
    ];

    const triangleCoords = [
        //{ lat: 42.7332315831520411, lng: -124.1351042993418656 },
        //{ lat: 42.7331995842957352, lng: -124.1351663111042027 },
        //{ lat: 42.7332101009541007, lng: -124.1350389033585198 },
        //{ lat: 42.7332315831520411, lng: -124.1351042993418656 }

        { lat: 0.7331991204766611, lng: -2.134846090749003 },
        { lat: 0.7332096174311878, lng: -2.13471866662489 },
        { lat: 0.7332311112695872, lng: -2.1347840658682014 },
        { lat: 0.7332084971878798, lng: -2.1340780852875056 },
        { lat: 0.7332300143135343, lng: -2.134143491011451 },
        { lat: 0.7332404685329014, lng: -2.1340160285945378 },
        { lat: 0.7332619871269741, lng: -2.1340814361978775 },
        { lat: 0.7331765240061834, lng: -2.134140138254518 },
        { lat: 0.7333265254900705, lng: -2.1342776600711777 },
        { lat: 0.7333369895189914, lng: -2.134150197156594 },
        { lat: 0.7333585008717356, lng: -2.134215607171638 },
        { lat: 0.7332515285361414, lng: -2.1342088969124413 },
        { lat: 0.7332835028178759, lng: -2.134146843978803 },
        { lat: 0.7332509150748296, lng: -2.133888558872105 },
        { lat: 0.7332724380407998, lng: -2.133953968175756 },
        { lat: 0.733282881276197, lng: -2.133826492849592 },
        { lat: 0.7333044057111264, lng: -2.1338919040313034 },
        { lat: 0.7331974226353395, lng: -2.1338852139228526 },
        { lat: 0.7332189470356818, lng: -2.133950621169343 },
        { lat: 0.7332293892056134, lng: -2.133823149747699 },
        { lat: 0.7333474458707796, lng: -2.134022726931853 },
        { lat: 0.7333689615954551, lng: -2.1340881386495725 },
        { lat: 0.7332315831520411, lng: -2.1351042993418656 }
    ]; */

    //var triangleCoords = getH3All();
    //while (logged_in == 0) { console.log("looping"); }

    var latLngArray = [];
    //var latArray = await getLatAll();
    var lngArray = await getLngAll();

    /*for (var i = 0; i < latArray.length; i++) {
        latArray[i] += 42;
    }
    for (var i = 0; i < lngArray.length; i++) {
        lngArray[i] -= 122;
    }*/
       
    for (let i = 0; i < lngArray.length; i += 2) {
        let gData = new maps.LatLng(parseFloat(lngArray[i]), parseFloat(lngArray[i+1]));
        latLngArray.push(gData);
    }

    console.log(latLngArray);

    var bermudaTriangle = new maps.Polygon({
        paths: latLngArray, //triangleCoords,
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

