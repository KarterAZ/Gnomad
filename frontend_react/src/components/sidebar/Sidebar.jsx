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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baselineSearch from '@iconify/icons-ic/baseline-search';
import { GoogleOAuthProvider } from '@react-oauth/google';

// internal imports.
import { LoginButton } from '../login_button/LoginButton';

import './sidebar.css';
import event from '../../utilities/event';

// key for google login api.
const client_id = '55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com';

// this class renders the Sidebar component.
export default function Sidebar({ toggleMarkerCreation }) 
{
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [showPinCreator, setShowPinCreator] = useState(false);

  // show / hide the Sidebar.
  const handleClick = () => 
  {
    if (!open)
    {
      setShowPinCreator(false);
    }

    setOpen(!open);
  }

  // change the sidebar width when the open state variable changes.
  useEffect(()=>
  {
    if (!open) 
    {
      // set max-width to 0px.
      document.getElementById('sidebar-container').style.maxWidth = '0px';
    }
    else 
    {
      // set max-width back to what the css specifies.
      document.getElementById('sidebar-container').style.maxWidth = null;
    }
  }, [open]);

  // this function is called when the search button is clicked.
  const search = async () => 
  {
    const query = document.getElementById('search-bar').value;
    console.log(query);
  }

  // open the pin creation menu, close the sidebar if its open.
  const showCreatePinMenu = () => 
  {
    setOpen(false);
    event.emit('show-pin-creator');
    //setShowPinCreator(true);
  }

  // show the cellular data.
  const showCellularData = () => 
  {
    event.emit('toggle-cellular-creator');
  }

  // create a pin from the dialog.
  const createPin = (pinName, pinDescription, pinType) => 
  {
    toggleMarkerCreation(pinName, pinDescription, pinType);
    setShowPinCreator(false);
  }

  // navigate to the create route page when the button is clicked.
  const createRoute = () => 
  {
    navigate('routes');
  }

  // render the sidebar.
  return (
    <div id='sidebar-container'>
      <div id='sidebar-content'>
        {/* login section */}
        <section className='section' id='header-section'>
          <div id='user-section'>
            <GoogleOAuthProvider clientId={client_id}>
              <LoginButton/>
            </GoogleOAuthProvider>
          </div>

          <div id='settings-button-wrapper'>
            <Icon id='settings-button' icon='ph:gear-six-duotone' />
          </div>
        </section>

        {/* search bar section */}
        <section className='section' id='search-section'>
          <label>Search</label>
          <div className='search-wrapper'>
            <input id='search-bar' className='text-input' type='text'></input>
            <button onClick={search} className='search-button'><Icon icon={baselineSearch} width="20" height="20" /></button>
          </div>
        </section>

        {/* pin list section */}
        <section className='section' id='pins-section'>
          <div id='pins-list'></div>
        </section>

        {/* buttons section */}
        <section className='section' id='create-buttons-section'>
        <button className='button' id='toggle-cellular-button' onClick={showCellularData}>
            Toggle Cellular Data
          </button>

          <button className='button' id='pin-add-button' onClick={showCreatePinMenu}>
            Create Pin
          </button>

          <button className='button' id='route-add-button' onClick={createRoute}>
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
