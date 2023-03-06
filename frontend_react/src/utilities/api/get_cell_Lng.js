//################################################################
//
// Authors: Karter Zwetschke
// Date: 12/19/2022
// 
// Purpose: Contains code to get all cell data
//
//################################################################

// internal imports.
import { get, isAuthenticated} from './api';

export default async function getLngAll() {

    //if (!isAuthenticated()) return null;

    const response = await get('h3_oregon_data/allLngCoords');

    if (response)
        console.log("response from lng");
    else
        console.log("null response lng");

    return response;
}