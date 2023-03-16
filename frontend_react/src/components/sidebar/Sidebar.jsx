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

const client_id = '55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com';

// this class renders the Sidebar component.
export default function Sidebar({ toggleMarkerCreation }) 
{
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [showPinCreator, setShowPinCreator] = useState(false);

  // show / hide the Sidebar
  const handleClick = () => 
  {
    if (!open)
    {
      setShowPinCreator(false);
    }

    setOpen(!open);
  }

  useEffect(()=>
  {
    if (!open) 
    {
      document.getElementById('sidebar-container').style.maxWidth = '0px';
    }
    else 
    {
      document.getElementById('sidebar-container').style.maxWidth = null;
    }
  }, [open]);

  // this function is called when the search button is clicked.
  const search = async () => 
  {
    const query = document.getElementById('search-bar').value;
    console.log(query);
  }

  const showCreatePinMenu = () => 
  {
    setOpen(false);
    setShowPinCreator(true);
  }

  const createPin = (pinName, pinDescription, pinType) => 
  {
    toggleMarkerCreation(pinName, pinDescription, pinType);
    setShowPinCreator(false);
  }

  const createRoute = () => 
  {
    navigate('routes');
  }

  const PinCreator = () =>
  {
    const [pinName, setPinName] = useState('');
    const [pinDescription, setPinDescription] = useState('');
    const [pinType, setPinType] = useState('');

    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [typeError, setTypeError] = useState('');

    const validateInput = () =>
    {
      if (pinName === '')
      {
        setNameError('This cannot be left blank.');
        return;
      }

      if (pinDescription === '')
      {
        setDescriptionError('This cannot be left blank.');
        return;
      }

      if (pinType === '')
      {
        setTypeError('This cannot be left blank.');
        return;
      }
      createPin(pinName, pinDescription, pinType);
    }

    return (
      <div id='pin-creator'>
        <div id='pin-creator-header'>
          <h2>Create a Pin</h2>
        </div>
        <div id='pin-creator-body'>
          <div className='input-section'>
          <span id='input-label-wrapper'><label>Pin Name</label> <label id='error'>{nameError}</label></span>
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

          <div className='input-section' id='pin-description-input-wrapper'>
            <span id='input-label-wrapper'><label>Pin Description</label> <label id='error'>{descriptionError}</label></span>
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

          <div className='input-section'>
            <span id='input-label-wrapper'><label>Pin Type</label> <label id='error'>{typeError}</label></span>
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

          <div className='input-section row gap-10'>
            <button className='button' onClick={() => {setShowPinCreator(false)}}>Cancel</button>
            <button className='button' onClick={validateInput}>Click to Place Pin</button>
          </div>
        </div>
      </div>
    );
  }

  // render the actual component.
  return (
    <div id='sidebar-container'>
      {showPinCreator && (<PinCreator/>)}
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
          <button className='button' id='pin-add-button' onClick={showCreatePinMenu}>
            Create Pin
          </button>

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
