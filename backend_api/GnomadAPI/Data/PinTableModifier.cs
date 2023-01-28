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
//using CommunityToolkit.Mvvm.DependencyInjection;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the Pins table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getAll, and add.
    //******************************************************************************
    public class PinTableModifier : IDataRepository<Pin>
    {
        //Defines tables for sql
        const string PIN_TABLE = "pins";
        const string TAG_TABLE = "pin_tags";
        /// <summary>
        /// Constructor
        /// </summary>
        public PinTableModifier(IConfiguration config)
        {

        }

        /// <summary>
        /// Gets a pin from its id
        /// </summary>
        /// <returns>
        /// Returns a Pin with all of its dara.
        ///</returns>
        public Pin getById(int id)
        {
            Pin pin = null;
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
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
                        pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetInt32(2);
                        pin.Latitude = reader.GetInt32(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);
                    }
                }
            }

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM " + TAG_TABLE + " WHERE(`id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pin.Tags.Add(reader.GetInt32(0));
                    }
                }
            }

            return pin;

        }

        /// <summary>
        /// Gets all pins
        /// </summary>
        /// <returns>
        /// A list of all Pins
        /// </returns>
        public List<Pin> getAll()
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

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

                        using (MySqlCommand command2 = new MySqlCommand())
                        {
                            command2.Connection = connection;
                            command2.CommandType = CommandType.Text;
                            command2.CommandText = "SELECT * FROM " + TAG_TABLE + " WHERE(`id` = @Id);";
                            command2.Parameters.AddWithValue("Id", pin.Id);

                            using (MySqlDataReader reader2 = command2.ExecuteReader())
                            {
                                while (reader2.Read())
                                {
                                    pin.Tags.Add(reader2.GetInt32(0));
                                }
                            }
                        }
                        pins.Add(pin);
                    }
                }
            }
            return pins;
        }

        /// <summary>
        /// Gets all pins from a specified user
        /// </summary>
        /// <returns>
        /// A list of all Pins from that user
        /// </returns>
        public List<Pin> getAllByUser(int uid)
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
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

                        using (MySqlCommand command2 = new MySqlCommand())
                        {
                            command2.Connection = connection;
                            command2.CommandType = CommandType.Text;
                            command2.CommandText = "SELECT * FROM " + TAG_TABLE + " WHERE(`id` = @Id);";
                            command2.Parameters.AddWithValue("Id", pin.Id);

                            using (MySqlDataReader reader2 = command2.ExecuteReader())
                            {
                                while (reader2.Read())
                                {
                                    pin.Tags.Add(reader2.GetInt32(0));
                                }
                            }
                        }
                        pins.Add(pin);
                    }
                }
            }

            return pins;
        }

        /// <summary>
        /// Adds a pin to the database
        /// </summary>
        /// <returns>
        /// A boolean value, true if entered successfully.
        /// </returns>
        public bool add(Pin pin)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

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
            
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TAG_TABLE + " (pin_id, tag_id) VALUES (@pin_id, @tag_id);";
                command.Parameters.AddWithValue("@pin_id", pin.Id);

                MySqlParameter tagIdParamaeter;

                foreach (int myTag in pin.Tags)
                {
                    tagIdParamaeter = new MySqlParameter("@tag_id", myTag);

                    command.Parameters.Add(tagIdParamaeter);
                    command.ExecuteNonQuery();
                    command.Parameters.Remove(tagIdParamaeter);
                }
            }

            return true; //Error handling here later.
        }

        /// <summary>
        /// Checks if a pin already exists
        /// </summary>
        /// <returns>
        /// Returns a boolean, true if in the database, else false.
        /// </returns>
        public bool contains(Pin data)
        {
            bool exists = false;
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            
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

        /// <summary>
        /// Gets the id of a pin based on its data.
        /// </summary>
        /// <returns>
        /// An int (the id) of the specified pin
        /// </returns>
        public int getId(Pin data)
        {
            throw new NotImplementedException();
        }
    }
}