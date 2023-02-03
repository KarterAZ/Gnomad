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
import h3 from 'h3-js/legacy';//CoordPair, { H3Index }, geoToH3, getResolution, cellToLatLng, cellToBoundary from 'h3-js';

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
    zoom: 17,
};

class SimpleMap extends React.Component {
    static defaultProp = {
        zoom: 5,
        center: { lat: 24.886, lng: -70.268 },
        mapTypeId: "terrain"
    };
}
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
    const triangleCoords = [
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
    bermudaTriangle.setMap(map);
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

                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                        yesIWantToUseGoogleMapApiInternals //this is important!
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                    >
                    
                    </GoogleMapReact>
                </div>
            </div>
        );
    }

    /*render() {
        let h3idx = this.getH3Index()

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

                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    />
                </div>
                {*//*<div style={{ height: `95%` }} className='d-flex'>
                    <div style={{ height: `100%`, width: `100%` }} className='p-2'>
                        <MyMapComponent
                            googleMapURL={map}
                            hexagons={h3KRing(h3idx, this.state.kringSize)}
                        />
                    </div>
                </div>*//*}
            </div>
        );
    }*/
}
