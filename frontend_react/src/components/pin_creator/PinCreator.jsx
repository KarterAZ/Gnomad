import { useState } from "react";
import event from "../../utilities/event";

export default function PinCreator()
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
          return false;
      }

      // TODO: replace these with regex for whitespace.
      if (pinDescription === '')
      {
          setDescriptionError('This cannot be left blank.');
          return false;
      }

      // TODO: replace these with regex for whitespace.
      if (pinType === '')
      {
          setTypeError('This cannot be left blank.');
          return false;
      }

      return true;
  }

  const submit = () =>
  {
      // if the input is fine, call create pin with the validated data.
      if (validateInput())
      {
          let pin = 
          {
              name: pinName, 
              description: pinDescription, 
              type: pinType
          };

          event.emit('create-pin', {pin});
          close();
      }
  }

  const close = () =>
  {
      event.emit('close-pin-creator');
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
          <button className='button' onClick={close}>Cancel</button>
          <button className='button' onClick={submit}>Click to Place Pin</button>
        </div>
      </div>
    </div>
  );
}