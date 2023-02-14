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

// this function gets cell data
export default async function getH3All()
{
    if (!isAuthenticated()) return null;

    const response = await get('h3_oregon_data/allH3Id');

    return response;
}