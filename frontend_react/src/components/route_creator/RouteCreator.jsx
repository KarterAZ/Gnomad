// RouteCreator

import { useEffect, useState } from "react";

import searchPins from '../../utilities/api/search_pins';
import event from "../../utilities/event";
import SearchBar from "../search_bar/SearchBar";

import './route_creator.css';

// Purpose: creates a window to allow the user to create a route.
export default function RouteCreator()
{
  // variable states.
  const [routeName, setRouteName] = useState('');
  const [routePins, setRoutePins] = useState([]);

  const [pinResults, setPinResults] = useState([]);

  // error states.
  const [nameError, setNameError] = useState('');
  const [pinsError, setPinsError] = useState('');

  // this function verifies that the input in each field is valid.
  // if its not valid it sets the correct error state.
  const validateInput = () =>
  {
    let status = true;
    // TODO: replace these with regex for whitespace.
    if (routeName.trim().length === 0)
    {
      setNameError('This cannot be left blank.');
      status = false;
    }

    if (routePins.length <= 0)
    {
      setPinsError('You must have at least one pin.');
      status =  false;
    }

    return status;
  }

  const submit = () =>
  {
    if (validateInput())
    {
      // TODO: create route here.
      close();
    }
}

  const close = () =>
  {
    event.emit('close-route-creator');
  }

  const search = async (searchQuery) =>
  {
    // remove whitespace from beginning and end of the query.
    let query = searchQuery.trim();

    // if the query is not empty...
    if (query.length !== 0)
    {
      // get the pins matching the search from backend.
      let pins = await searchPins(searchQuery);

      // set the pins to a pin list.
      setPinResults(pins.map((pin, index) => <ListPin key={index} pin={pin}/>));
    }
  }

  const addToRoute = (pin) =>
  {
    setRoutePins(list => [...list, pin]);
  }

  const ListPin = ({pin}) =>
  {
    return (
      <li>
        <div className='result-pin'>
          <span className='add-pin-title'>{pin.title}</span>
          <button className='add-pin-button' onClick={() => addToRoute(pin)}>+</button>
        </div>
      </li>
    );
  }

  // HTML for the pin creation window.
  return (
      <div id='route-creator'>
          <div id='creator-header'>
              <h2>Create a Route</h2>
          </div>

          <div id='creator-body'>
              {/* section to enter route name */}
              <div className='input-section'>
                  <span id='input-label-wrapper'><label>Route Name</label> <label className='error'>{nameError}</label></span>
                  <input 
                      className='text-input' 
                      type='text' 
                      onChange={(event) => 
                      {
                          setRouteName(event.target.value); 
                          setNameError('');
                      }} 
                  />
              </div>

              <div className='input-section' id='pin-description-input-wrapper'>
                  <div id='route-pins-picker'>
                      <div className='split-section' id='search-pins-list-wrapper'>
                          <div>
                          <label>Search for pins to add</label>
                          <SearchBar onSubmit={search}/>
                          </div>
                          <div id='pins-search-results'>
                          <ul id='search-pins-list'>
                              {pinResults}
                          </ul>
                          </div>
                      </div>
                      <div className='split-section'>
                          <label>Pins</label>
                          <ul id='route-pins-list'>
                          {routePins.map((pin, index) => (
                              <li key={index}>{pin.title}</li>
                          ))}
                          </ul>
                      </div>
                  </div>
              </div>
              
              {/* section with the buttons */}
              <div className='input-section row gap-10'>
                  <button className='button' onClick={close}>Cancel</button>
                  <button className='button' onClick={submit}>Create Route</button>
              </div>
          </div>
      </div>
  );
}