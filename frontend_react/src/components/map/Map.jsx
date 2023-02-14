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
//import h3, { CoordPair, H3Index, geoToH3, getResolution, cellToLatLng, cellToBoundary } from 'h3-js/legacy';
import { h3ToGeo, h3ToGeoBoundry } from "h3-reactnative";

// internal imports.
import './map.css';
import getAll from '../../utilities/api/get_cell_data';

// internal imports.
import './map.css';
import './markers.css';
import pin from './pin.png';
import bathroom from './restroom.svg';
import fuel from './gas-station-svgrepo-com.svg';

//can later make the default lat/lng be user's location?
const defaultProps = {
  zoom: 6,
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
};

//var dataList = getAll();

/*function getH3Index() {
    const dataList = getAll();

    for (let cell of dataList) {
        // get h3 resolution
        const h3Res = h3.getResolution(cell.H3id);

        // Get the center of the hexagon
        const hexCenterCoordinates = h3.cellToLatLng(cell.H3id);

        // Get the vertices of the hexagon
        const hexBoundary = h3.cellToBoundary(cell.H3id);
    }
    // get geo to h3
    //const geoToH3(this.state.lat, this.state.lng, this.state.resolution);
}*/

const handleApiLoaded = (map, maps) => {

    //const datalist = null;

    //if(dataList == null)

    //var  = new Array(20);//dataList.length);
    const hexBoundary = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0 }
    ];
    const hexNums = [
        { hex:"8928116c923ffff" },
        { hex: "8928116c937ffff"},
        { hex: "8928116c93bffff"},
        { hex: "8928116c947ffff"},
        { hex: "8928116c94bffff"},
        { hex: "8928116c94fffff"},
        { hex: "8928116ca03ffff"},
        { hex: "8928116ca07ffff"},
        { hex: "8928116ca0bffff"},
        { hex: "8928116ca0fffff"},
        { hex: "8928116ca17ffff"},
        { hex: "8928116ca27ffff"},
        { hex: "8928116ca2bffff"},
        { hex: "8928116ca2fffff"},
        { hex: "8928116ca33ffff"},
        { hex: "8928116ca3bffff"},
        { hex: "8928116ca43ffff"},
        { hex: "8928116ca47ffff"},
        { hex: "8928116ca4bffff"},
        { hex: "8928116c923ffff"}
    ];

    var i = 0;

    for (const hex in hexNums) {
        // get h3 resolution
        //const h3Res = h3.getResolution(cell.H3id);

        // Get the center of the hexagon
        if (i === 0) {
            var cent = h3ToGeo(hex);
            defaultProps.center.lat = cent[0];
            defaultProps.center.lng = cent[1];
        }

        // Get the vertices of the hexagon
        var hexlatlng = h3ToGeo(hex);//h3.cellToBoundary(cell.H3id);
        hexBoundary[i].lat = hexlatlng[0];
        hexBoundary[i].lng = hexlatlng[1];

        i++;
    }

    //hexBoundary[25] = hexCenterCoordinates

    var bermudaTriangle = new maps.Polygon({
        paths: hexBoundary,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });
    bermudaTriangle.setMap(map);

    /*const triangleCoords = [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 }
    ];

    var bermudaTriangle = new maps.Polygon({
        paths: triangleCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });
    bermudaTriangle.setMap(map);*/
}

//Array of markers that gets used to populate map, eventually will be filled with pin data from database
const presetMarkers = [
  { lat: 42.248914596430176, lng: -121.78688309747336, image: bathroom },
  { lat: 42.25850950074424, lng: -121.79943326457828, image: fuel },
  { lat: 42.25644490904306, lng: -121.7859578463942, image: pin },
];

//for testing marker clustering
// top left     42.26395149771135, -121.84449621695097
// bottom right 42.21184409530869, -121.75111242724213

//General format all pins will follow, made dynamic by adding image data member instead of having 3-4 separte versions 
const CustomMarker = ({ lat, lng, image }) => (
  <img
    src={image}
    alt="marker"
    style={{
      position: 'absolute', // absolute/fixed/static/sticky/relative
      width: '50px',
      height: '50px',
    }}
    lat={lat}
    lng={lng}
  />
);

export default function Map() {
  //State declared for storing markers
  const [markers, setMarkers] = useState(presetMarkers);

  //State declared for enabling/disabling marker creation on click with sidebar
  const [markerCreationEnabled, setMarkerCreationEnabled] = useState(false);

  //Function that toggles the sidebar's create pin option
  const toggleMarkerCreation = () => {
    setMarkerCreationEnabled(!markerCreationEnabled);
  };

  //Function handling onclick events on the map that will result in marker creation
  const handleMapClick = (event) => {
    //Adds marker to array that gets rendered (Eventually will have to add a pin to the database)
    setMarkers([...markers, {
      lat: event.lat,
      lng: event.lng,
      image: pin,
    }]);
  };

  //Populating presetMarkers with data from array/database
  useEffect(() => {
    fetch('') // api endpoint will go here (having trouble running backend at the moment)
      .then(response => response.json())
      .then(data => setMarkers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div id='map'>
      <div id='wrapper'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals //this is important!
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          onClick={handleMapClick}
        >

          {markers.map((marker, index) => ( //Renders presetMarkers on the map
            <CustomMarker
              key={index}
              lat={marker.lat}
              lng={marker.lng}
              image={marker.image}
            />
          ))}

        </GoogleMapReact>
      </div>
    </div>
  );
}
