//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the google login react component
//
//################################################################

import { googleLogout } from '@react-oauth/google';
import { useState } from 'react';
import { setCookie, getCookie } from '../../utilities/cookies';

import './login_button.css';

// LoginButton component
function LoginButton() 
{

  const [logged_in, setLoggedIn] = useState(false);

  // Save the access token returned on login
  window.SaveAccessToken = (response) => 
  {
    // set the token
    setCookie('id_token', response.credential);

    const cookie = 'Bearer ' + getCookie('id_token');

    const user = fetch('https://localhost:5000/', 
    {
      headers: 
      {
        Accept: '*/*',
        Authorization: cookie
      }
    })
    .then(resp => resp.json())
    .then(json => { return(json.value) })

    setCookie('first_name', user.firstName);
    setCookie('last_name', user.LastName);
    setLoggedIn(true);
  }

  const logout = () =>
  {
    googleLogout();
    setLoggedIn(false);
  }

  if (!logged_in)
  {
    return (
      <>
      <div id="g_id_onload"
        data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="SaveAccessToken"
        data-auto_prompt="false">
      </div>

      <div className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin"
        data-size="large"
        data-logo_alignment="left">
      </div>
      <button className='user-button' onClick={ logout }>
        Logout
      </button>
      </>
    );
  }
  else
  {
    return (
      <>
        <button className='user-button' onClick={ logout }>
          Logout
        </button>
      </>
    );
  }
}

export { LoginButton }
