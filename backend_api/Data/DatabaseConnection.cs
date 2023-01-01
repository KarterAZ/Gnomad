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
        //private MySqlConnection _connection;
        private static DatabaseConnection _instance;

        private DatabaseConnection()
        {
            string connection_string = Startup.getConnectionString();
            //_connection = new MySqlConnection(connection_string);
        }


        public static DatabaseConnection getInstance()
        {
            if (_instance == null)
            {
                _instance = new DatabaseConnection();
            }

            return _instance;
        }


        //Creates an opens a connection
        public MySqlConnection getConnection()
        {
            //If connection pooling is on default by MySql when creating a connection it should grab a connection from the pool here
            MySqlConnection connection = new MySqlConnection(connection_string);
            connection.Open();
            return connection;
        }

        
        //Closes connection and puts it back in the pool .Net should do it by default
        public void closeConnection(MySqlConnection connection)
        {
            connection.Close();
        }

        // public MySqlConnection getConnection()
        // {
        //     return _connection;
        // }

        // public void openConnection()
        // {
        //     _connection.Open();
        // }

    }
}
