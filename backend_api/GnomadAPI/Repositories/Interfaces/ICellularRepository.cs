/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/27/2023
*
* Purpose: Defines the default functions for dependency injection. Declares getByH3Id, getAll
*
************************************************************************************************/

using H3Lib;
using System;
using System.Collections.Generic;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI.Data
{
    public interface ICellularRepository
    {
        //******************************************************************************
        //This class defines the default functions for dependency injection
        //Declares getByH3Id, getAll
        //******************************************************************************

        public Cellular getByH3Id(string id);

        public List<Cellular> getAll();

        public List<string> getAllH3(int offset);

        public (List<float>, List<float>) getAllCoords(float latMin, float lngMin, float latMax, float lngMax);

        public List<float> getAllCoordsSingle(float latMin, float lngMin, float latMax, float lngMax);

        public List<int> getIdsInRange(float latMin, float lngMin, float latMax, float lngMax);

        public List<decimal> getHexCoords(int pass);
    }
}
