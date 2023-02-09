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
import h3 from 'h3-js/legacy';

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
                    />
                </div>
            </div>
        );
    }
}
