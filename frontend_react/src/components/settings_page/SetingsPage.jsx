// SettingsPage

import './settings_page.css';

// Purpose: creates a window to allow the user to create a route.
export default function SettingsPage()
{
  // HTML for the settings window.
  return (
      <div id='settings-page'>
          <div id='gnomad-header'>
              <h1>Gnomad</h1>
          </div>

          <div id='gnomad-logo'>
            <img src="../images/Pin.png" alt="Gnomad logo" />
          </div>

          <div id='creator-body'>
            With a base of Google Maps, the Codenomes have added various things such 
            as pins and a cellular overlay to build Gnomad, the ultimate travel companion.
          </div>

          <div id ='author-section'>
            Gnomad was developed by the Codenomes:
            Andrew Ramirez
            Andrew Rice
            Bryce Schults
            Stphen Thompson
            Karter Zwetschke
          </div>
      </div>
  );
}