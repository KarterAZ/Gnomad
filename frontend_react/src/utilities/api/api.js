import { getCookie } from '../cookies';

const api_uri = 'https://localhost:5000/';

const auth_token = getCookie('id_token');

export function getToken()
{
  console.log(auth_token);
  return auth_token;
}

export function isAuthenticated()
{
  return (auth_token !== undefined);
}

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