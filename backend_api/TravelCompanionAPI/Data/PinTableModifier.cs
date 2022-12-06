﻿using MySql.Data.MySqlClient;
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
    //This class updates the Pins table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getAll, and add.
    //******************************************************************************
    public class PinTableModifier : IDataRepository<Pin>
    {
        const string TABLE = "pins";
        private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public PinTableModifier(IConfiguration config)
        {
            //Switch depending on mode
            string connection = null;
            //connection = config.GetConnectionString("CodenomeDatabase");
            connection = config.GetConnectionString("TestingDatabase");

            _connection = new MySqlConnection(connection);
        }

        public Pin getById(int id)
        {
            Pin pins = null;
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM + " + TABLE + " WHERE(`id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pins = new Pin();
                        pins.Id = reader.GetInt32(0);
                        pins.UserId = reader.GetInt32(1);
                        pins.Longitude = reader.GetInt32(2);
                        pins.Latitude = reader.GetInt32(3);
                        pins.Title = reader.GetString(4);
                        pins.Street = reader.GetString(5);
                    }
                }
            }

            _connection.Close();

            return pins;
        }

        public List<Pin> getAll()
        {
            List<Pin> pins = new List<Pin>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + ";";

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetInt32(2);
                        pin.Latitude = reader.GetInt32(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);
                        pin.Add(pin);
                    }
                }
            }

            _connection.Close();

            return pins;
        }

        public List<Pin> getAllByUser(int uid)
        {
            List<Pin> pins = new List<Pin>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`user_id` = @Uid);";
                command.Parameters.AddWithValue("Uid", uid);

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetInt32(2);
                        pin.Latitude = reader.GetInt32(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);
                        pin.Add(pin);
                    }
                }
            }

            _connection.Close();

            return pins;
        }

        public int add(Pin pin)
        {
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (longitude, latitude, title, street) VALUES (@Longitude, @Latitude, @Title, @Street);";
                command.Parameters.AddWithValue("@Longitude", pin.Longitude);
                command.Parameters.AddWithValue("@DLatitude", pin.Latitude);
                command.Parameters.AddWithValue("@Title", pin.Title);
                command.Parameters.AddWithValue("@Street", pin.Street);

                _connection.Open();

                command.ExecuteNonQuery();
            }

            _connection.Close();

            return 0;
        }
    }
}