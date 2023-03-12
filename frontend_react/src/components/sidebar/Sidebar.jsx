//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the sidebar react component.
//
//################################################################

// external imports.
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baselineSearch from '@iconify/icons-ic/baseline-search';
import { GoogleOAuthProvider } from '@react-oauth/google';

// internal imports.
import { LoginButton } from '../login_button/LoginButton';

import './sidebar.css';

const client_id = '55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com';

// this class renders the Sidebar component.
export default function Sidebar({ toggleMarkerCreation }) {
  const navigate = useNavigate();

  let [open, setOpen] = useState(true);

  const [pinType, setPinType] = useState("");

  // show / hide the Sidebar
  const handleClick = () => {
    if (open) {
      document.getElementById('sidebar-container').style.width = '0%';
    }
    else {
      document.getElementById('sidebar-container').style.width = '100%';
    }

    setOpen(!open);
  }

  // this function is called when the search button is clicked.
  const search = async () => {
    const query = document.getElementById('search-bar').value;
    console.log(query);
  }

  const createPin = () => {
    toggleMarkerCreation(pinType);

  }

  const createRoute = () => {
    navigate('routes');
  }

  // render the actual component.
  return (
    <div id='sidebar-container'>
      <div id='sidebar-content'>
        <section className='section' id='header-section'>
          <div id='user-section'>
            <GoogleOAuthProvider clientId={client_id}>
              <LoginButton />
            </GoogleOAuthProvider>
          </div>

          <div id='settings-button-wrapper'>
            <Icon id='settings-button' icon='ph:gear-six-duotone' />
          </div>
        </section>

        <section className='section' id='search-section'>
          <label>Search</label>
          <div className='search-wrapper'>
            <input id='search-bar' className='text-input' type='text'></input>
            <button onClick={search} className='search-button'><Icon icon={baselineSearch} width="20" height="20" /></button>
          </div>
        </section>

        <section className='section' id='pins-section'>
          <div id='pins-list'></div>

        </section>
        <section className='section' id='create-buttons-section'>
          <button className='button' id='pin-add-button' onClick={createPin}>
            Create Pin
          </button>

          <div style={{ textAlign: 'center' }}>
            <label>Pin Type: </label>
            {/*Dropdown menu for pin selection */}
            <select id="pinType" value={pinType} onChange={(e) => setPinType(e.target.value)}/*Updates pinType when option changes */>
              {/*First option, doesn't create pins when handleCreatePin gets called in Map.jsx */}
              <option value="">--Select--</option>
              {/*Valid options for pinTypes*/}
              <option value="bathroom">Bathroom</option>
              <option value="electric">Supercharger</option>
              <option value="diesel">Diesel</option>
              <option value="wifi">Free Wifi</option>
              <option value="pin">Gnome</option>
              <option value="fuel">Regular Fuel</option>
            </select>
          </div>

          <button className='button' id='route-add-button' onClick={createRoute}>
            Create Route
          </button>

        </section>
      </div>
      <div onClick={handleClick} id='handle'>
        <Icon icon='charm:menu-hamburger' />
      </div>
    </div>
  );
}
