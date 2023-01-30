//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: The google map component.
//
//################################################################


import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';


// internal imports.
import './map.css';
import './markers.css';
import pin from './pin.png'; 


const defaultProps = {
  center: {
    lat: 42.2565,
    lng: -121.78,
  },
  zoom: 17,
};



const Marker = ({ lat, lng }) => (
  <img src={pin} alt="pin" style={{
    position: 'absolute',
    transform: `translate(${-20 / 2}px,${-40}px)`,
    width: '80px',
    height: '70px',
    text: "Sample Text",
  }}
  lat={lat}
  lng={lng}
  />
);

export default class Map extends Component {
  state = {
    markers: []
  }
  constructor(props)
  {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);
  }
  handleMapClick = (event) => {
    const { lat, lng } = event;
    this.setState(prevState => ({ markers: [...prevState.markers, { lat, lng }] }))
  }

  render() {
    return (
      <div id='map'>
        <div id='wrapper'>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCHOIzfsDzudB0Zlw5YnxLpjXQvwPmTI2o' }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <Marker
              lat={42.255}
              lng={-121.7855}
              text="Oregon Tech"
            />
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}


