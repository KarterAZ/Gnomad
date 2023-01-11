/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 12/28/2022
*
* Purpose: Holds the functions for table modifications and access.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using TravelCompanionAPI.Models;
using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the Pins table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getAll, and add.
    //******************************************************************************
    public class PinTableModifier : IDataRepository<Pin>
    {
        const string PIN_TABLE = "pins";
        const string TAG_TABLE = "pinTags";
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public PinTableModifier(IConfiguration config)
        {

        }



        public Pin getById(int id)
        {

            Pin pins = null;
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM " + PIN_TABLE + " WHERE(`id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

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
                //TODO: get pinTags data, add to pin (should just be one since pin id, not user id.
            }

            return pins;

        }

        public List<Pin> getAll()
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + PIN_TABLE + ";";


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
                        pins.Add(pin);
                    }
                }
                //TODO: get pinTags data, add to pin
            }
            return pins;
        }

        public List<Pin> getAllByUser(int uid)
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + PIN_TABLE + " WHERE(`user_id` = @Uid);";
                command.Parameters.AddWithValue("@Uid", uid);

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
                        pins.Add(pin);
                    }
                }
                //TODO: get pinTags data, add to pin
            }

            return pins;
        }

        public void add(Pin pin)
        {
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + PIN_TABLE + " (user_id, longitude, latitude, title, street) VALUES (@userID, @Longitude, @Latitude, @Title, @Street);";
                command.Parameters.AddWithValue("@userId", pin.UserId);
                command.Parameters.AddWithValue("@Longitude", pin.Longitude);
                command.Parameters.AddWithValue("@Latitude", pin.Latitude);
                command.Parameters.AddWithValue("@Title", pin.Title);
                command.Parameters.AddWithValue("@Street", pin.Street);

                command.ExecuteNonQuery();
            }
            //TODO: add Tag to pins
        }


        public bool contains(Pin data)
        {
            bool exists = false;
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + PIN_TABLE + " WHERE longitude = @Longitude AND latitude=@Latitude;";
                command.Parameters.AddWithValue("@Longitude", data.Longitude);
                command.Parameters.AddWithValue("@Latitude", data.Latitude);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        if (data.Longitude == int.Parse(reader.GetString(0)) && data.Latitude == int.Parse(reader.GetString(1)))
                        {
                            exists = true;
                            break;
                        }
                    }
                }
            }

            return exists;
        }

        Pin IDataRepository<Pin>.getAllByUser(int uid)
        {
            throw new NotImplementedException();
        }

        int IDataRepository<Pin>.add(Pin data)
        {
            throw new NotImplementedException();
        }
    }
}