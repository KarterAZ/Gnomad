//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Sets up the root page element and renders App
//
//################################################################

import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './pwa_code/serviceWorkerRegistration';
import reportWebVitals from './pwa_code/reportWebVitals';

import './index.css';
import App from './App';

// Get the root element and create a react root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application.
root.render(
    <App/>
);

// Register the service worker to make the PWA cache correctly.
serviceWorkerRegistration.register();

// Report web vitals
reportWebVitals();
