﻿/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Defines the default functions for dependency injection. Declares getById, getAll, and add.
*
************************************************************************************************/

using System.Collections.Generic;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI.Data
{
    //TODO: Might need <> to specify pin or sticker, or just make sticker same class as pin.
    public interface IPinRepository
    {
        //******************************************************************************
        //This class defines the default functions for dependency injection
        //******************************************************************************

        public Pin getById(int id);

        public int getId(Pin data);

        public List<Pin> getAll();

        public bool add(Pin data);

        public bool contains(Pin data);
        
        List<Pin> getAllByUser(int uid);

        List<Pin> getAllInArea(double latStart = 0, double longStart = 0, double latRange = 0, double longRange = 0);
    
        List<Pin> getAllByTag(List<int> tags);
    }
}