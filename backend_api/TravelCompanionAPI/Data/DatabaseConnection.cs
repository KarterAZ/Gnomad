//#############################################################
//
// Author: Bryce Schultz
// Date: 11/1/2022
// 
// Purpose: A singleton base class database connector for
// accessing the MySQL database
//
//#############################################################

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace TravelCompanionAPI.Data
{
    public abstract class DatabaseConnection
    {
        protected string _server;
        protected string _database;
        protected string _username;
        protected string _password;
        protected MySqlConnection _connection;

        public bool isConnected()
        {
            if (String.IsNullOrEmpty(_database))
            {
                return false;
            }

            if (_connection == null)
            {
                try
                {
                    string connstring = string.Format("Server={0}; database={1}; UID={2}; password={3}", _server, _database, _username, _password);
                    _connection = new MySqlConnection(connstring);
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
