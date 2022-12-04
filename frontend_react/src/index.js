import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com">
    <App/>
  </GoogleOAuthProvider>
);

serviceWorkerRegistration.register();

reportWebVitals();
