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

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    // This class updates the PinTags table, inheriting from IDataRepository.
    // No new methods added.
    // Implements getByPinId, getByTagId, getAll, and add.
    //******************************************************************************
    public class PinTagTableModifier : IPinTagDataRepository<PinTag>
    {
        const string TABLE = "pin_tags";
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public PinTagTableModifier()
        { }

        /// <summary>
        /// Gets a pintag (pin id and user id)
        /// </summary>
        /// <returns>
        /// A list of pintags
        /// </returns>
        /// 

        public List<PinTag> getByPinId(int pid)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            List<PinTag> pintags = new List<PinTag>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`pin_id` = @Pid);";
                command.Parameters.AddWithValue("@Pid", pid);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PinTag pintag = new PinTag();
                        pintag.PinId = reader.GetInt32(0);
                        pintag.TagId = reader.GetInt32(1);
                        pintags.Add(pintag);
                    }
                }
            }

            connection.Close();

            return pintags;
        }

        /// <summary>
        /// Should be user id?
        /// </summary>
        /// <returns>
        /// A list of all Pins
        /// </returns>
        /*public List<PinTag> getByTagId(int tid)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            List<PinTag> pintags = new List<PinTag>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`tag_id` = @Tid);";
                command.Parameters.AddWithValue("@Tid", tid);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PinTag pintag = new PinTag();
                        pintag.PinId = reader.GetInt32(0);
                        pintag.TagId = reader.GetInt32(1);
                        pintags.Add(pintag);
                    }
                }
            }

            connection.Close();

            return pintags;
        }*/

        /// <summary>
        /// Gets all PinTags
        /// </summary>
        /// <returns>
        /// A list of all PinTags
        /// </returns>
        public List<PinTag> getAll()
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            List<PinTag> pintags = new List<PinTag>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + ";";

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PinTag pintag = new PinTag();
                        pintag.PinId = reader.GetInt32(0);
                        pintag.TagId = reader.GetInt32(1);
                        pintags.Add(pintag);
                    }
                }
            }

            connection.Close();

            return pintags;
        }

        /// <summary>
        /// Adds a PinTag
        /// </summary>
        /// <returns>
        /// Returns a boolean, true if added to the database.
        /// </returns>
        public bool add(PinTag pintag)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (pin_id, tag_id) VALUES (@PiD, @Tid);";
                command.Parameters.AddWithValue("@Pid", pintag.PinId);
                command.Parameters.AddWithValue("@Tid", pintag.TagId);

                command.ExecuteNonQuery();
            }

            connection.Close();

            return true; //Error handling later.
        }

        /// <summary>
        /// ? Shouldn't be here.
        /// </summary>
        /// <returns>
        /// A list of all Pins
        /// </returns>
        /*private readonly object _lockObject = new object(); //??
        public bool contains(Sticker sticker)
        {
            lock (_lockObject)
            {
                MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
                bool exists = false;

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE longitude = @Longitude AND latitude=@Latitude;";
                    command.Parameters.AddWithValue("@Longitude", sticker.Longitude);
                    command.Parameters.AddWithValue("@Latitude", sticker.Latitude);

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (sticker.Longitude == int.Parse(reader.GetString(0)) && sticker.Latitude == int.Parse(reader.GetString(1)))
                            {
                                exists = true;
                                break;
                            }
                        }
                    }
                }

                connection.Close();

                return exists;
            }
        }*/
    }
}