//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################

// external imports.
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
//import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from "react-google-maps"
import h3, { CoordPair, H3Index, geoToH3, getResolution, cellToLatLng, cellToBoundary } from 'h3-js/legacy';//CoordPair, { H3Index }, geoToH3, getResolution, cellToLatLng, cellToBoundary from 'h3-js';

// internal imports.
import './map.css';
import getAll from '../../utilities/api/get_cell_data';

// defualt location the map points to.
const defaultProps =
{
    center: {
        lat: 42.2565,
        lng: -121.7855,
    },
    zoom: 8,
};

/*class SimpleMap extends React.Component {
    static defaultProp = {
        zoom: 5,
        center: { lat: 24.886, lng: -70.268 },
        mapTypeId: "terrain"
    };
}*/

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

    for (const hex of hexNums) {
        // get h3 resolution
        //const h3Res = h3.getResolution(cell.H3id);

        // Get the center of the hexagon
        if (i === 0) {
            var cent = cellToLatLng(hex);
            defaultProps.center.lat = cent[0];
            defaultProps.center.lng = cent[1];
        }

        // Get the vertices of the hexagon
        var hexlatlng = cellToLatLng(hex);//h3.cellToBoundary(cell.H3id);
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


// this class renders the map component.
export default class Map extends Component {
    //returns all hexagons in a radius around a specified point
    //could be used to load only visible hexagons
    //h3.gridDisk(h3index, ring(num));

    render() {
        return (
            <div id='map'>
                <div id='wrapper'>
                    <GoogleMapReact
                        bootstrapURLKeys=
                        {
                            {
                                key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o',
                            }
                        }

                        defaultZoom={defaultProps.zoom}
                        yesIWantToUseGoogleMapApiInternals //this is important!
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        defaultCenter={defaultProps.center}
                    >
                    
                    </GoogleMapReact>
                </div>
            </div>
        );
    }
}
