import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './map.css';

const defaultProps = {
  center: {
    lat: 42.2565,
    lng: -121.7855,
  },
  zoom: 17,
};

class Map extends Component {
  render() {
    return (
      <div id='map'>
        <div id='wrapper'>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o',
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          ></GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default Map;
