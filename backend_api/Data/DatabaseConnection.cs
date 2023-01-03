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
    public class DatabaseConnection : IDatabaseConnection
    {
        
         //connection = config.GetConnectionString("CodenomeDatabase");
         //connection = config.GetConnectionString("TestingDatabase");
         //Not sure if the above needs to be used at all? Saw these in all the modifer classes when they were self definining their own connection
         
        private static DatabaseConnection _instance;

        private DatabaseConnection()
        {
            string connection_string = Startup.getConnectionString();
           
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

    }
}
