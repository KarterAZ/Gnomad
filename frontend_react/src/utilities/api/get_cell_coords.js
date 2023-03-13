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

export default async function getAllCoords(pass) {

    if (!isAuthenticated()) return null;

    const response = await get('h3_oregon_data/allHexCoords/' + String(pass));

    return response;
}