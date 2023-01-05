import { getCookie } from '../cookies';

const api_uri = 'https://localhost:5000/';

const auth_token = getCookie('id_token') || undefined;

export function getToken()
{
    return auth_token;
}

export function isAuthenticated()
{
    return (auth_token !== undefined);
}

export function get(path)
{
    const result = fetch(api_uri + path, 
    {
      headers: 
      {
        Accept: '*/*',
        Authorization: auth_token
      }
    })
    .then(resp => resp.json())
    .then(json => { return(json) });

    return result;
}

export function post(path, data)
{
    
}