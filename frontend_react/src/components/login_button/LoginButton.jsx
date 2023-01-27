//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the google login react component
//
//################################################################

// external imports.
import { useState } from 'react';

// internal imports.
import login from '../../utilities/api/login';
import { setCookie } from '../../utilities/cookies';
import { sstore } from '../../utilities/session_storage';

import './login_button.css';

// this function renders the login button.
export function LoginButton() 
{
  // use state to show and hide the login button.
  const [logged_in, setLoggedIn] = useState(false);

  // this function is called when a 
  // responce is recieved from google OAuth.
  window.SaveAccessToken = async (response) => 
  {
    // save the access token returned on login.
    setCookie('id_token', 'Bearer ' + response.credential);

    // call login on the backend and get the user.
    const user = await login();
    
    // store the user in session storage.
    sstore('user', user);

    // hide the login button.
    setLoggedIn(true);
  }

  // setup internal style to show and hide the login button.
  let in_style = {display: 'flex' };

  // if the user is logged in, hide the login button.
  if (logged_in) 
  {
      in_style = {display: 'none'};
  };
  
  // render the actual button.
  return (
    <>
      <div id="g_id_onload"
        data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="SaveAccessToken"
        data-auto_prompt="false">
      </div>

      <div style={in_style} 
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin"
        data-size="large"
        data-logo_alignment="left">
      </div>
    </>
  );
}
