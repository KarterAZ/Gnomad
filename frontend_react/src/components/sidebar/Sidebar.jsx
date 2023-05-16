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
import { useEffect, useState, useRef } from 'react';
import baselineSearch from '@iconify/icons-ic/baseline-search';
import { GoogleOAuthProvider } from '@react-oauth/google';

// internal imports.
import { LoginButton } from '../login_button/LoginButton';
import getRoutes from '../../utilities/api/get_routes';

import './sidebar.css';
import event from '../../utilities/event';
import SearchBar from '../search_bar/SearchBar';

// key for google login api.
const client_id = '55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com';

// this class renders the Sidebar component.

export default function Sidebar({ setExcludedArray }) {
  const toggle_ref = useRef();
  const [open, setOpen] = useState(true);
  const [userRoutes, setUserRoutes] = useState([]);

  const sidebar = useRef();

  // show / hide the Sidebar.
  const handleClick = () => {
    if (!open) {
      event.emit('close-pin-creator');
      event.emit('close-route-creator');
    }

    setOpen(!open);
  }

  const handleCheckboxClick = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setExcludedArray((prevExcludedArr) => [...prevExcludedArr, value]);
    } else {
      setExcludedArray((prevExcludedArr) => prevExcludedArr.filter((item) => item !== value));
    }
  };

  //console.log(excludedArr); //testing to make sure checkbox click retaining values in excludedArr.

  const loadRoutes = async (query) => {
    // get the users routes.
    let response = await getRoutes();

    // check if the query was successful.
    if (response != null) {
      // filter the response to match the search query.
      response = response.filter(route =>
        route.title.toLowerCase().includes(query.toLowerCase()));

      // const to store the converted routes.
      const routes = response.map((route, index) => <li key={index}>{route.title}</li>)

      // update the state.
      setUserRoutes(routes);
    }
    else {
      // the query failed, log an error.
      console.log('Failed to get routes.');
    }
  }

  useEffect(() => 
  {
    loadRoutes('');

    event.on('close-route-creator', () => {
      loadRoutes('');
    });

    event.on('cancel-cellular-overlay', () => 
    {

      toggle_ref.current.checked = false;
    });
  }, []);


  // change the sidebar width when the open state variable changes.
  useEffect(() => {
    if (!open) {
      // set max-width to 0px.
      sidebar.current.style.maxWidth = '0px';
    }
    else {
      // set max-width back to what the css specifies.
      sidebar.current.style.maxWidth = null;
    }
  }, [open]);

  // this function is called when the search button is clicked.
  const search = async () => {
    const query = document.getElementById('search-bar').value;
    console.log(query);
  }


  // open the pin creation menu, close the sidebar if its open.
  const showCreatePinMenu = () => {
    setOpen(false);
    event.emit('show-pin-creator');
  }

  // show the cellular data.
  const showCellularData = () => {
    if (toggle_ref.current.checked)
      event.emit('toggle-cellular-creator-on');
    else
      event.emit('toggle-cellular-creator-off');
  }

  // create a pin from the dialog.
  const showCreateRouteMenu = (pinName, pinDescription, pinType) => {
    setOpen(false);
    event.emit('show-route-creator');
  }

  // render the sidebar.
  return (
    <div ref={sidebar} id='sidebar-container'>
      <div id='sidebar-content'>
        {/* login section */}
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

        {/* search bar section */}
        <section className='section' id='search-section'>
          <label>Search</label>
          <SearchBar onSubmit={loadRoutes} />
          <div id='checkboxes'>
            <div className='checkbox-group'>
              <label>
                <input type='checkbox' name='checkboxBathrooms' value='/static/media/Restroom.bd2c8abecc2db6e2f278.png' onClick={handleCheckboxClick} />
                Bathrooms
              </label>
              <label>
                <input type='checkbox' name='checkboxSuperchargers' value='/static/media/Charger.63912282ba06bd3b8c0a.png' onClick={handleCheckboxClick} />
                Superchargers
              </label>
              <label>
                <input type='checkbox' name='checkboxFuel' value='/static/media/Gas.3accb04e10d7ce18c293.png' onClick={handleCheckboxClick} />
                Regular Fuel
              </label>
            </div>
            <div className='checkbox-group'>
              <label>
                <input type='checkbox' name='checkboxDiesel' value='/static/media/Diesel.59635fc105450eb3246e.png' onClick={handleCheckboxClick} />
                Diesel
              </label>
              <label class="wifi-label">
                <input type='checkbox' name='checkboxWifi' value='/static/media/WiFi.7f5ccf4e56885ffb49d4.png' onClick={handleCheckboxClick} />
                Wifi
              </label>
              <label>
                <input type='checkbox' name='checkboxGnome' value='/static/media/Pin.70731107db4fbfc9454c.png' onClick={handleCheckboxClick} />
                Gnome
              </label>
            </div>
          </div>
        </section>

        {/* pin list section */}
        <section className='section' id='pins-section'>
          <div id='pins-list'>
            <ul>
              {userRoutes}
            </ul>
          </div>
        </section>

        {/* buttons section */}
        <section className='section' id='create-buttons-section'>


          <div>
            <label id='toggle-cellular-label'>
              Toggle Cellular Data:
            </label>
            <label className="switch" id='cellular-toggle-switch'>
              <input ref={toggle_ref} id='cellular_toggle_value' type="checkbox" onClick={showCellularData} />
              <span className="slider round"></span>
            </label>
          </div>


          <button className='button' id='pin-add-button' onClick={showCreatePinMenu}>
            Create Pin
          </button>

          <button className='button' id='route-add-button' onClick={showCreateRouteMenu}>
            Create Route
          </button>

        </section>
      </div>

      {/* the open / close menu button */}
      <div onClick={handleClick} id='handle'>
        <Icon icon='charm:menu-hamburger' />
      </div>
    </div>
  );
}

