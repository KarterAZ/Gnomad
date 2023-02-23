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

import './login_button.css';

// this function renders the login button.
export function LoginButton() 
{

  const [logged_in, setLoggedIn] = useState(false);

  window.googleLogin = async (response) =>
  {
    setCookie('id_token', 'Bearer ' + response.credential);
    const user = await login();
    setLoggedIn(true);

    console.log('user:', user);
  }

  const logout = () =>
  {
    setLoggedIn(false);
  }
  
  /*const signin = useGoogleLogin({
    onSuccess: res => onSuccess(res),
    onError: res => onError(res),
  });

  const onSuccess = async (res) =>
  {
    console.log(res.access_token);

    // save the access token returned on login.
    setCookie('id_token', 'Bearer ' + res.access_token);

    // call login on the backend and get the user.
    const user = await login();

    console.log(user);

    if (user !== undefined)
    {
      setLoggedIn(true);
    }
    
    // store the user in session storage.
    sstore('user', user);
  };

  const onError = async (res) =>
  {
  }
  */

  if (!logged_in)
  {
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
  else
  {
    <>
        <div id="g_id_onload"
          data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
          data-context="signout"
          data-ux_mode="popup"
          data-callback="googleLogin"
          data-auto_select="true"
          data-itp_support="true">
        </div>

        <div className="g_id_signout"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_black"
            data-text="signout"
            data-size="medium"
            data-logo_alignment="left">
        </div>
      </>
    /*return(
      <button onClick={logout}>Logout</button>
    );*/
  }
}
