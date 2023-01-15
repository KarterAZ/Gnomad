/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/14/2023
*
* Purpose: Gets the connection string to connect to the mySql database.
*
************************************************************************************************/

using Microsoft.Extensions.Configuration;

namespace GnomadAPI.Data
{
    public abstract class Connection
    {
        public string ConnectionString { get; set; }
    }
}
