/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/10/2023
*
* Purpose: Contains Interface for MySql getConnection
*
************************************************************************************************/

using GnomadAPI.Data;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace TravelCompanionAPI.Data
{   
    public interface IDatabaseConnection<T> where T : Connection
    {
        public MySqlConnection getConnection();
    }
}
