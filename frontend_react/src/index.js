//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Sets up the root page element and renders App
//
//################################################################

// external imports.
import React from 'react';
import ReactDOM from 'react-dom/client';

// pwa related imports.
import * as serviceWorkerRegistration from './pwa_code/serviceWorkerRegistration';
import reportWebVitals from './pwa_code/reportWebVitals';

// internal imports.
import './index.css';
import App from './App';

// get the root element and create a react root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// render the App component to the root of the document.
root.render(
    <App/>
);

/*let map;
<script src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.416775, lng: -3.703790 },
        zoom: 12
    });
    map.data.loadGeoJson('bdc_41_4G-LTE_mobile_broadband_h3_063022.json');
}
Window.initMap = initMap;*/

// register the service worker to make the PWA cache correctly.
serviceWorkerRegistration.register();

// report web vitals for future improvements.
reportWebVitals();
