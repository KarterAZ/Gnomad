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

// this function provides handy access to the auth token.
export function getToken()
{
  return getCookie('id_token');
}

// this function ensures that the auth_token is valid.
export function isAuthenticated()
{
  const auth_token = getToken();
  return (auth_token !== undefined);
}

// this function will make a get request to 
// the backend api and return the json data.
export async function get(path, params = [])
{
  // create the default request.
  let request = api_uri + path;

  // see if any params got passed in.
  if (params.length > 0)
  {
    // if we have params append a ? to the url ex: api.gnomad.com/endpoint?
    request += '?';

    // loop over the params that got passed in.
    for (let i = 0; i < params.length; i++)
    {
      // append the param to the url ex: api.gnomad.com/endpoint?q=somequery
      request += params[i];

      // if this wasn't the last param append an & symbol to the url.
      // ex: api.gnomad.com/endpoint?q=somequery&
      if (i !== params.length - 1)
      {
        request += '&';
      }
    }
  }

  // get the auth token.
  const auth_token = getToken();

  // call fetch given the request string.
  const result = await fetch(request, 
  {
    // setup the headers.
    headers: 
    {
      Accept: '*/*',
      // ensure that authentication is working.
      Authorization: auth_token
    }
  })
  .then(resp => resp.json())
  .then(json => {return json.value})
  .catch((error) => 
  {
    console.log('Fetch Error:', error);
  });

  return result;
}

// this function will make a post request to 
// the backend api and return the json data
// it also takes an object as data to send.
export async function post(path, data = {})
{
  // get the auth token.
  const auth_token = getToken();

  // create the request string.
  const request = api_uri + path;

  // make a POST request to the api.
  const result = await fetch(request, 
  {
    // use POST method.
    method: 'POST',
    // set the headers.
    headers: 
    {
      Accept: '*/*',
      // add the auth token.
      Authorization: auth_token
    },
    // add the request content.
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(json => {return json.value})
  .catch((error) => 
  {
    console.log('Fetch Error:', error);
  });

  return result;
}