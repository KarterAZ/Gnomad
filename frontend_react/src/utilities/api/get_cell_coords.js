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

export default async function getAllCoords(latMin, lngMin, latMax, lngMax) {

    //if (!isAuthenticated()) return null;
    //const responseLatLng = await get('h3_oregon_data/allCoords/' + String(latMin) + '/' + String(lngMin) + '/' +
      //  String(latMax) + '/' + String(lngMax));

    const responseLatLng = await get('h3_oregon_data/allCoordsSingle/' + String(latMin) + '/' + String(lngMin) + '/' +
        String(latMax) + '/' + String(lngMax));

    return responseLatLng;
}