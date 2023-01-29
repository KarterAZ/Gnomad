/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/20/2023
*
* Purpose: Holds the functions for table access.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.Common;
using System.Data;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the h3_oregon_data table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getByH3Id, getAll
    //******************************************************************************
    public class CellularTableModifier : ICellDataRepository<Cellular>
    {
        const string TABLE = "h3_oregon_data";
        private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public CellularTableModifier(IConfiguration config)
        {
            //Switch depending on mode
            string connection = null;
            //connection = config.GetConnectionString("CodenomeDatabase");
            connection = config.GetConnectionString("TestingDatabase");

            _connection = new MySqlConnection(connection);
        }

        public Cellular getByH3Id(string id)
        {
            Cellular cellular = null;
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM + " + TABLE + " WHERE(`h3_res9_id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        cellular = new Cellular();
                        cellular.Technology = reader.GetInt32(0);
                        cellular.Mindown = reader.GetInt32(1);
                        cellular.Minup = reader.GetInt32(2);
                        cellular.Environment = reader.GetInt32(3);
                        cellular.H3id = reader.GetString(4);
                    }
                }
            }

            _connection.Close();

            return cellular;
        }

        public List<Cellular> getAll()
        {
            List<Cellular> h3_oregon_data = new List<Cellular>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " Limit 25 ;";

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Cellular cellular = new Cellular();
                        cellular.Technology = reader.GetInt32(0);
                        cellular.Mindown = reader.GetInt32(1);
                        cellular.Minup = reader.GetInt32(2);
                        cellular.Environment = reader.GetInt32(3);
                        cellular.H3id = reader.GetString(4);
                        h3_oregon_data.Add(cellular);
                    }
                }
            }

            _connection.Close();

            return h3_oregon_data;
        }
    }
}