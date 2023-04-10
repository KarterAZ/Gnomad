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

        public void SaveToDatabase();

        public Cellular getByH3Id(string id);

        public List<Cellular> getAll();

        public List<string> getAllH3();

        public List<decimal> getHexCoords(int pass);
    }
}
