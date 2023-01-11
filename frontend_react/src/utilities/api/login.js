//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Contains code to log the user in.
//
//################################################################

// internal imports.
import { post } from './api'

// this function makes a post request to user/login
// the user from the database is returned with correct
// user id.
export default async function login()
{
    let user = await post('user/login');

    return user;
}