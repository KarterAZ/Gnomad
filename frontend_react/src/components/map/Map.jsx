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

// this class renders the map component.
export default class Map extends Component {
    /*getH3Index() {
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

    //returns all hexagons in a radius around a specified point
    //could be used to load only visible hexagons
    //h3.gridDisk(h3index, ring(num));

    render() {
        //let h3idx = this.getH3Index()

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
                {/*<div style={{ height: `95%` }} className='d-flex'>
                    <div style={{ height: `100%`, width: `100%` }} className='p-2'>
                        <MyMapComponent
                            googleMapURL={map}
                            hexagons={h3KRing(h3idx, this.state.kringSize)}
                        />
                    </div>
                </div>*/}
            </div>
        );
    }
}
