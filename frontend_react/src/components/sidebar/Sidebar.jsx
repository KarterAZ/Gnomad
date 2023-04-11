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
    setShowPinCreator(true);
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

  // PinCreator
  //
  // Purpose: creates a window to allow the user to create a pin.

  const PinCreator = () =>
  {
    // variable states.
    const [pinName, setPinName] = useState('');
    const [pinDescription, setPinDescription] = useState('');
    const [pinType, setPinType] = useState('');

    // error states.
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [typeError, setTypeError] = useState('');

    // this function verifies that the input in each field is valid.
    // if its not valid it sets the correct error state.
    const validateInput = () =>
    {
      // TODO: replace these with regex for whitespace.
      if (pinName === '')
      {
        setNameError('This cannot be left blank.');
        return;
      }

      // TODO: replace these with regex for whitespace.
      if (pinDescription === '')
      {
        setDescriptionError('This cannot be left blank.');
        return;
      }

      // TODO: replace these with regex for whitespace.
      if (pinType === '')
      {
        setTypeError('This cannot be left blank.');
        return;
      }

      // if the input is fine, call create pin with the validated data.
      createPin(pinName, pinDescription, pinType);
    }

    // HTML for the pin creation window.
    return (
      <div id='pin-creator'>
        <div id='pin-creator-header'>
          <h2>Create a Pin</h2>
        </div>

        {/* section to enter pin name */}
        <div id='pin-creator-body'>
          <div className='input-section'>
          <span id='input-label-wrapper'><label>Pin Name</label> <label className='error'>{nameError}</label></span>
            <input 
              className='text-input' 
              type='text' 
              onChange={(event) => 
                {
                  setPinName(event.target.value); 
                  setNameError('');
                }} 
            />
          </div>
          
          {/* section to enter pin description */}
          <div className='input-section' id='pin-description-input-wrapper'>
            <span id='input-label-wrapper'><label>Pin Description</label> <label className='error'>{descriptionError}</label></span>
            <textarea 
              className='text-input' 
              id='pin-description-input' 
              type='text' 
              onChange={(event) => 
                {
                  setPinDescription(event.target.value);
                  setDescriptionError('');
                }} 
            />
          </div>
          
          {/* section to enter pin type */}
          <div className='input-section'>
            <span id='input-label-wrapper'><label>Pin Type</label> <label className='error'>{typeError}</label></span>
            <select 
              className='text-input' 
              id="pin-type" 
              value={pinType} 
              onChange={(e) => setPinType(e.target.value)}
            >
              <option value="">--Select--</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Supercharger">Supercharger</option>
              <option value="Diesel">Diesel</option>
              <option value="Wi-Fi">Free Wi-Fi</option>
              <option value="Pin">Gnome</option>
              <option value="Fuel">Regular Fuel</option>
            </select>
          </div>
          
          {/* section with the buttons */}
          <div className='input-section row gap-10'>
            <button className='button' onClick={() => {setShowPinCreator(false)}}>Cancel</button>
            <button className='button' onClick={validateInput}>Click to Place Pin</button>
          </div>
        </div>
      </div>
    );
  }

  // render the sidebar.
  return (
    <div id='sidebar-container'>
      {/* if showPinCreator is true, render the pin creator */}
      {showPinCreator && (<PinCreator/>)}

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
