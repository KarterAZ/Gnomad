//################################################################
//
// Authors: Bryce Schultz, Andrew Rice
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

import './login_button.css';

// this function renders the login button.
export function LoginButton() 
{
  console.log("Calling LoginButton()");

  const [logged_in, setLoggedIn] = useState(0);
  //const [elementVisible, setElementVisible] = useState(logged_in);

  window.googleLogin = async (response) =>
  {
    console.log(response);
    console.log(response.credential);
    setCookie('id_token', 'Bearer ' + response.credential);
    const user = await login();
    if(logged_in === 0)
      setLoggedIn(1);
    else 
      setLoggedIn(1)

    console.log('user:', user);
  }

  const logout = () =>
  {
    setLoggedIn(2);
  }

  if (logged_in === 0)
  {
    console.log("(0)logged_in = " + logged_in);
    // render the actual button.
    return (
      <>
        <div id="g_id_onload"
          data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="googleLogin"
          data-auto_select="true"
          data-itp_support="true">
        </div>

        <div className="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_black"
            data-text="signin"
            data-size="medium"
            data-logo_alignment="left">
        </div>
      </>
    );
  }
  else if(logged_in === 1)
  {
    console.log("(1)logged_in = " + logged_in);
    return(
        <button className='user-button' onClick={logout}>Logout</button>
        );
  }
  else
  {
    console.log("(2)logged_in = " + logged_in);
    window.location.reload(false); //Only way to get button to load is to reload page.
    //Requires double refresh
    /*return(
        <button className='user-button' onClick={window.googleLogin}>Login</button>
        );*/ 
  }
}