/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/10/2023
*
* Purpose: Contains TestingDatabase class
*
************************************************************************************************/

using Microsoft.Extensions.Configuration;

namespace GnomadAPI.Data
{
    public class TestingDatabase : Connection
    {
        TestingDatabase(IConfiguration config)
        {
            ConnectionString = config.GetConnectionString("TestingDatabase");
        }
    }
}
