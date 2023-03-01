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
    public interface ITagDataRepository<T> where T : IDataEntity
    {
        //******************************************************************************
        //This class defines the default functions for dependency injection
        //******************************************************************************

        public T getById(int id);

        public List<T> getAll();

        public bool add(T data);
    }
}
