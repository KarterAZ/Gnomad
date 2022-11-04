//#############################################################
//
// Author: Bryce Schultz
// Date: 11/1/2022
// 
// Purpose: A singleton base class database connector for
// accessing the MySQL database
//
// Modified: none.
//
//#############################################################

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace TravelCompanionAPI.Data
{
    public abstract class DatabaseConnection
    {
        protected MySqlConnection _connection;
        IConfiguration _config;

        public DatabaseConnection(IConfiguration config)
        {
            _config = config;
        }

        public bool isConnected()
        {
            if (_connection == null)
            {
                try
                {
                    _connection = new MySqlConnection(_config.GetConnectionString("CodenomeDatabase"));
                    //_connection = new MySqlConnection(_config.GetConnectionString("TestingDatabase"));
                    _connection.Open();
                }
                catch (Exception e)
                {
                    Console.WriteLine("{0}", e.Message);
                }
            }

            return true;
        }

        public MySqlDataReader runQuery(string query)
        {
            if (isConnected())
            {
                try
                {
                    var command = new MySqlCommand(query, _connection);
                    return command.ExecuteReader();
                }
                catch (Exception e)
                {
                    Console.WriteLine("{0}", e.Message);
                }
            }

            return null;
        }

        public void runNonQuery(string query)
        {
            if (isConnected())
            {
                try
                {
                    var command = new MySqlCommand(query, _connection);
                    var result = command.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                    Console.WriteLine("{0}", e.Message);
                }
            }
        }

        public void closeConnection()
        {
            if (isConnected())
            {
                _connection.Close();
                _connection = null;
            }
        }


    }
}
