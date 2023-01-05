//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the google login react component
//
//################################################################

import login from '../../utilities/api/login';
import { useState } from 'react';
import { setCookie } from '../../utilities/cookies';

import './login_button.css';
import { sstore } from '../../utilities/session_storage';
import { lstore } from '../../utilities/local_storage';

// LoginButton component
export function LoginButton() 
{
  const [logged_in, setLoggedIn] = useState(false);

  // Save the access token returned on login
  window.SaveAccessToken = async (response) => 
  {
    //TODO: verify that the token works
    setCookie('id_token', 'Bearer ' + response.credential);

    const user = await login();

    sstore('user', user);
    lstore('user', user);
    setLoggedIn(true);
  }

  let in_style = {display: 'flex' };

  if (logged_in) 
  {
      in_style = {display: 'none'};
  };
    
  return (
    <>
    <div id="g_id_onload"
      data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="SaveAccessToken"
      data-auto_prompt="false">
    </div>

    <div style={in_style} className="g_id_signin"
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
