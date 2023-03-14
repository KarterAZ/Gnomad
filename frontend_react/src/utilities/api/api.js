//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Contains code to access the backend api.
//
//################################################################

// internal import.
import { getCookie } from '../cookies';

// set the api_url, should be loaded from an environment variable.
const api_uri = 'https://localhost:5000/';

// get the auth token from the browser cookies.

// this function provides handy access to the auth token.
export function getToken()
{
  return getCookie('id_token');
}

// this function ensures that the auth_token is valid.
export function isAuthenticated()
{
  return (getToken() !== undefined);
}

// this function will make a get request to 
// the backend api and return the json data.
export async function get(path)
{
  const result = await fetch(api_uri + path, 
  {
    headers: 
    {
      Accept: '*/*',
      Authorization: getToken()
    }
  })
  .then(resp => resp.json())
  .then(json => {return json.value})

  return result;
}


// this function will make a post request to 
// the backend api and return the json data
// it also takes an object as data to send.
export async function post(path, data = {})
{
  const result = await fetch(api_uri + path, 
  {
    method: 'POST',
    headers: 
    {
      Accept: '*/*',
      Authorization: getToken()
    }
  })
  .then(resp => resp.json())
  .then(json => {return json.value});

  return result;
}