/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: This class contains all the Database Connection Functions.
*
************************************************************************************************/

using GnomadAPI.Data;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace TravelCompanionAPI.Data
{
    public class TestingDatabaseConnection : IDatabaseConnection<TestingDatabase>
    {         
        private static TestingDatabaseConnection _instance;
        private static string _connection_string;

        private TestingDatabaseConnection()
        {
            _connection_string = "";
        }

        public static TestingDatabaseConnection getInstance()
        {
            if (_instance == null)
            {;
                _instance = new TestingDatabaseConnection();
            }

            return _instance;
        }

        public MySqlConnection getConnection()
        {
            if (_connection_string == null) return null;

            MySqlConnection connection = new MySqlConnection(_connection_string);
            connection.Open();
            return connection;
        }
    }
}
