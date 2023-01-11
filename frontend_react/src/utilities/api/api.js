// internal import.
import { getCookie } from '../cookies';

// set the api_url, should be loaded from an environment variable.
const api_uri = 'https://localhost:5000/';

// get the auth token from the browser cookies.
const auth_token = getCookie('id_token');

// this function provides handy access to the auth token.
export function getToken()
{
  return auth_token;
}

// this function ensures that the auth_token is valid.
export function isAuthenticated()
{
  return (auth_token !== undefined);
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
      Authorization: auth_token
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
      Authorization: auth_token
    }
  })
  .then(resp => resp.json())
  .then(json => {return json.value});

  return result;
}