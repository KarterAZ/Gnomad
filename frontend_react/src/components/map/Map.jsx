import React from 'react'
import GoogleMapReact from 'google-map-react'
import './map.css'

const key = process.env.REACT_APP_API_KEY

const Map = ({ location, zoomLevel }) => (
  <div className="map">
    <GoogleMapReact
        bootstrapURLKeys={{ key: key}}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      />
  </div>
)

export default Map