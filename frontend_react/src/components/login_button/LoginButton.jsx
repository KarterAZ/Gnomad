//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the google login react component
//
//################################################################

import { googleLogout } from '@react-oauth/google';
import { setCookie } from '../../utilities/cookies';
import './login_button.css';

// Save the access token returned on login
window.SaveAccessToken = (response) => 
{
  setCookie('id_token', response.credential);
}

// LoginButton component
function LoginButton() 
{
  return (
    <>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
      <div id="g_id_onload"
          data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
          data-callback="SaveAccessToken">
      </div>
      <div className="g_id_signin" data-type="standard"></div>
    </>
  );
}

// LogoutButton component
function LogoutButton() {
  return (
    <button className='user-button' onClick={googleLogout()}>
      Logout
    </button>
  );
}

export { LoginButton, LogoutButton }
