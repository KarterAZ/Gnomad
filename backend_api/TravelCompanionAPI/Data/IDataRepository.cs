/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Defines the default functions for dependency injection. Declares getById, getAll, and add.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.Common;
using System.Data;

namespace TravelCompanionAPI.Data
{
    public interface IDataRepository<T> where T : IDataEntity
    {
        //******************************************************************************
        //This class defines the default functions for dependency injection
        //Declares getById, getAll, and add.
        //******************************************************************************

        public T getById(int id);

        public List<T> getAll();

        public int add(T data);

        public bool contains(T data);
    }
}
