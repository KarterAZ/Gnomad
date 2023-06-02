//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: React component for rendering the directions
//
//################################################################

// external imports.
import React, { Component } from 'react';

// internal imports.
import './directions.css';

// this class renders the Directions component
const DirectionsPanel = ({ directions, onClose, setShowDirections  }) => 
{
  const handleClick = () => {
    if (onClose) {
      onClose();
      setShowDirections(false); // set showDirections to false when closing the directions panel
    }
  };

  if (!directions) 
  {
    return null;
  }
  //console.log(directionsPanelContent);
  
  const { routes } = directions;
  const route = routes[0];
  const { legs } = route;
  const leg = legs[0];
  const { steps } = leg;
  const nextStep = steps[0];

  const directionsPanelContent = directions?.routes[0]?.legs[0]?.steps[0]?.instructions;

  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(directionsPanelContent, 'text/html');
  const textContent = parsedHtml.body.textContent;
  // parser is used to remove junk from text that was appearing before, such as <b> and </b>
  
  return (
    <div className="directions-panel">
      <div className="directions-panel-next-turn">
        <div className="directions-panel-next-turn-icon">
          <i className="fas fa-arrow-right"></i>  
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="directions-panel-next-turn-text">
          {textContent}
        </div>
      </div>
      <div className="directions-panel-estimated-time">
        {leg.duration.text} ({leg.distance.text})
      </div>
    </div>
  );
};

export default DirectionsPanel;