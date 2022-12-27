/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: This class contains all the Database Connection Functions.
*
************************************************************************************************/

using MySql.Data.MySqlClient;

namespace TravelCompanionAPI.Data
{
    public class DatabaseConnection
    {
        private MySqlConnection _connection;
        private static DatabaseConnection _instance;

        private DatabaseConnection()
        {
            string connection_string = Startup.getConnectionString();
            _connection = new MySqlConnection(connection_string);
        }

        public static DatabaseConnection getInstance()
        {
            if (_instance == null)
            {
                _instance = new DatabaseConnection();
            }

            return _instance;
        }

        public void openConnection()
        {
            _connection.Open();
        }

        public void closeConnection()
        {
            _connection.Close();
        }

        public MySqlConnection getConnection()
        {
            return _connection;
        }
    }
}
