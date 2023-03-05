/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: This class contains all the Database Connection Functions.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System;

namespace TravelCompanionAPI.Data
{
    public class DatabaseConnection
    {
        private static DatabaseConnection _instance;
        private string _connection_string;

        private DatabaseConnection()
        { }

        public void setConnectionString(string connection_string)
        {
            _connection_string = connection_string;
        }

        public static DatabaseConnection getInstance()
        {
            if (_instance == null)
            {
                _instance = new DatabaseConnection();
            }

            return _instance;
        }

        public MySqlConnection getConnection()
        {
            if (_connection_string == null)
            {
                throw new Exception("DatabaseConnection does not have a connection string.");
            }

            MySqlConnection connection = new MySqlConnection(_connection_string);
            connection.Open();
            return connection;
        }
    }
}
