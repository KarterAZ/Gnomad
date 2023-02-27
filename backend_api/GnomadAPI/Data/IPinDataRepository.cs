/************************************************************************************************
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
    public interface IPinDataRepository<T> where T : IDataEntity
    {
        //******************************************************************************
        //This class defines the default functions for dependency injection
        //******************************************************************************

        public T getById(int id);

        public int getId(T data);

        public List<T> getAll();

        public bool add(T data);

        public bool contains(T data);
        
        List<T> getAllByUser(int uid);

        List<Pin> getAllInArea(double latStart = 0, double longStart = 0, double latRange = 0, double longRange = 0);
    
        List<Pin> GetAllByTag(List<int> tags);
    }
}
