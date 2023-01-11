//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Contains function to save and get objects in the
// local storage (on device storage).
//
//################################################################

// this function stores some object 
// at some key in the local storgae.
export function lstore(key, value)
{
    localStorage.setItem(key, JSON.stringify(value));
}

// this function gets some object
// from local storage at some key.
export function lget(key)
{
    return JSON.parse(localStorage.getItem(key));
}