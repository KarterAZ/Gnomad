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
    public interface ICellDataRepository<T> where T : IDataEntity
    {
        //******************************************************************************
        //This class defines the default functions for dependency injection
        //Declares getByH3Id, getAll
        //******************************************************************************

        public T getByH3Id(string id);

        public List<T> getAll();

        public List<string> getAllH3();

        public List<Tuple<decimal, decimal>> getCoords();

        public List<decimal> getHexCoords();

        public decimal[] getCoordsLat();
        public decimal[] getCoordsLng();
    }
}
