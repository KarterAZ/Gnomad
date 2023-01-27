//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the google login react component
//
//################################################################

// external imports.
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

// internal imports.
import login from '../../utilities/api/login';
import { setCookie } from '../../utilities/cookies';
import { sstore } from '../../utilities/session_storage';

import './login_button.css';

// this function renders the login button.
export function LoginButton() 
{

  const [logged_in, setLoggedIn] = useState(false);
  
  const signin = useGoogleLogin({
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

  if (!logged_in)
  {
    // render the actual button.
    return (
      <button className='user-button' onClick={signin}>Login</button>
    );
  }
  else
  {
    return(
      <>
      </>
    );
  }
}
