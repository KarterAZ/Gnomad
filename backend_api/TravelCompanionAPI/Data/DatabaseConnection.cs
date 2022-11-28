using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Extensions.Configuration;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Configuration;

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
