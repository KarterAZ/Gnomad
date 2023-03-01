//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Contains code to log the user in.
//
//################################################################

// internal imports.
import { post } from './api';
import { sstore, sget } from '../session_storage';
import { setCookie } from '../cookies';

// this function makes a post request to user/login
// the user from the database is returned with correct
// user id.

const logged_in_key = 'logged_in';

export default async function login(token)
{
    // set the id_token cookie.
    setCookie('id_token', 'Bearer ' + token);

    // send a post request to login.
    let user = await post('user/login');

    // if the user was logged in successfully, set 
    // the session variable for logged_in to true.
    if (user !== undefined)
    {
        sstore(logged_in_key, true);
    }

    return user;
}

export async function logout()
{
    // on logout set the session variable to 
    // false, and remove the id_token cookie.
    sstore(logged_in_key, false);
}

export function isLoggedIn()
{
    return sget(logged_in_key);
}