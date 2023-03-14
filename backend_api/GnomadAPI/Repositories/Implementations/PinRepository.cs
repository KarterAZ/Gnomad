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
//using CommunityToolkit.Mvvm.DependencyInjection;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the Pins table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getAll, and add.
    //******************************************************************************
    public class PinRepository : IPinRepository
    {
        //Defines tables for sql
        const string PIN_TABLE = "pins";
        const string TAG_TABLE = "pin_tags";
        /// <summary>
        /// Constructor
        /// </summary>
        public PinRepository(IConfiguration config)
        {
            //TODO: do we need the config?
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
                command.CommandText = "SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " WHERE(`id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);
                    }
                }
            }

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pin.Tags.Add(reader.GetInt32(0));
                    }
                }
            }

            connection.Close();
            
            return pin;
        }

        /// <summary>
        /// Gets all pins in the specified area, defaulting to Oregon Tech
        /// </summary>
        /// <returns>
        /// A list of all Pins in the specified area.
        /// </returns>
        public List<Pin> getAllInArea(double latStart = 42.257, double longStart = 121.7852, double latRange = 1, double longRange = 1)
        {
            double minLat = latStart - latRange;
            double maxLat = latStart + latRange;
            double minLong = longStart - longRange;
            double maxLong = longStart + longRange;

            List<Pin> pins_in_area = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + 
                                    " WHERE(longitude > @minLong AND longitude < @maxLong AND latitude > @minLat AND latitude < @maxLat) LIMIT 100;";

                command.Parameters.AddWithValue("@minLong", minLong);
                command.Parameters.AddWithValue("@minLat", minLat);
                command.Parameters.AddWithValue("@maxLong", maxLong);
                command.Parameters.AddWithValue("@maxLat", maxLat);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);

                        pins_in_area.Add(pin);
                    }
                }
            }


            using (MySqlCommand command2 = new MySqlCommand())
            {
                command2.Connection = connection;
                command2.CommandType = CommandType.Text;
                command2.CommandText = @"SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";

                MySqlParameter idParameter;

                foreach (Pin pin in pins_in_area)
                {
                    idParameter = new MySqlParameter("Id", pin.Id);
                    command2.Parameters.Add(idParameter);

                    using (MySqlDataReader reader2 = command2.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            pin.Tags.Add(reader2.GetInt32(0));
                        }
                    }
                    command2.Parameters.Remove(idParameter);
                }
            }

            connection.Close();

            return pins_in_area;
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
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " LIMIT 50;";

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);

                        pins.Add(pin);
                    }
                }
            }


            using (MySqlCommand command2 = new MySqlCommand())
            {
                command2.Connection = connection;
                command2.CommandType = CommandType.Text;
                command2.CommandText = "SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";

                MySqlParameter idParameter;

                foreach (Pin pin in pins)
                {
                    idParameter = new MySqlParameter("Id", pin.Id);
                    command2.Parameters.Add(idParameter);

                    using (MySqlDataReader reader2 = command2.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            pin.Tags.Add(reader2.GetInt32(0));
                        }
                    }
                    command2.Parameters.Remove(idParameter);
                }
            }
            connection.Close();
            return pins;
        }

        //Gets pins that have the search bar input string in the title
        public List<Pin> getByName(string searchString)
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                //Search the pins table title column for strings with the search string in it.
                //Set all to lower to dismiss case sensitivity
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " WHERE(LOWER(title) LIKE LOWER(@SearchString));";
                command.Parameters.AddWithValue("@SearchString", "%" + searchString + "%");

                //Go through and add to pin list
                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);

                        pins.Add(pin);
                    }
                }
            }
            //Add tag to the pins in the pin list
            using (MySqlCommand command2 = new MySqlCommand())
            {
                command2.Connection = connection;
                command2.CommandType = CommandType.Text;
                command2.CommandText = "SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";

                MySqlParameter idParameter;

                foreach (Pin pin in pins)
                {
                    idParameter = new MySqlParameter("Id", pin.Id);
                    command2.Parameters.Add(idParameter);

                    using (MySqlDataReader reader2 = command2.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            pin.Tags.Add(reader2.GetInt32(0)); //Gets the tag
                        }
                    }
                    command2.Parameters.Remove(idParameter); //Don't need id
                }
            }
            connection.Close();
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
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " WHERE(`user_id` = @Uid);";
                command.Parameters.AddWithValue("@Uid", uid);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);

                        pins.Add(pin);
                    }
                }

            }

            using (MySqlCommand command2 = new MySqlCommand())
            {
                command2.Connection = connection;
                command2.CommandType = CommandType.Text;
                command2.CommandText = "SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";

                MySqlParameter idParameter;

                foreach (Pin pin in pins)
                {
                    idParameter = new MySqlParameter("Id", pin.Id);
                    command2.Parameters.Add(idParameter);

                    using (MySqlDataReader reader2 = command2.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            pin.Tags.Add(reader2.GetInt32(0));
                        }
                    }
                    command2.Parameters.Remove(idParameter);
                }
            }

            connection.Close();
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

                pin.Id = (int)command.LastInsertedId;
            }
            
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TAG_TABLE + " (pin_id, tag_id) VALUES (@pin_id, @tag_id);";
                command.Parameters.AddWithValue("@pin_id", pin.Id);

                MySqlParameter tagIdParameter;
                
                //Adds each tag as a parameter and sends a new query for each.
                foreach (int myTag in pin.Tags)
                {
                    tagIdParameter = new MySqlParameter("@tag_id", myTag);

                    command.Parameters.Add(tagIdParameter);
                    command.ExecuteNonQuery();
                    command.Parameters.Remove(tagIdParameter);
                }
            }

            connection.Close();
            return true;
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
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " WHERE longitude = @Longitude AND latitude = @Latitude;";
                command.Parameters.AddWithValue("@Longitude", data.Longitude);
                command.Parameters.AddWithValue("@Latitude", data.Latitude);

                //TODO: return count with query, and just check if > 0. Check UserRepo for example code
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

            connection.Close();
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
            //TODO: implement or delete function
            throw new NotImplementedException();
        }

        /// <summary>
        /// Gets all pins with any of the given tags
        /// </summary>
        /// <returns>
        /// A list of pins
        /// </returns>
        public List<Pin> getAllByTag(List<int> tags)
        {
            List<Pin> pins;
            List<Pin> deleteList = new List<Pin>();
            pins = getAll(); //TODO: change to getAllInArea() and get area data passed into funtion

            //Checks if pin is valid, adds to deleteList
            foreach(Pin pin in pins)
            {
                bool delete = true;
                foreach(int tag in tags)
                {
                    if(delete)
                    {
                        if(pin.Tags.Contains(tag))
                        {
                            delete = false;
                        }
                    }
                }
                if(delete)
                {
                    deleteList.Add(pin);
                }
            }

            //Remove all pins without the specified tags
            pins.RemoveAll(pin => (deleteList.Contains(pin)));

            return pins;
        }

        public List<Pin> getAllByAddress(string address)
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                //Search the pins table for pins with similar streets.
                //Set all to lower to dismiss case sensitivity
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " WHERE(LOWER(street) LIKE @address) LIMIT 100;";
                command.Parameters.AddWithValue("@address", "%" + address.ToLower() + "%");

                //Go through and add pin to pins list
                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);

                        pins.Add(pin);
                    }
                }
            }

            //Add tag to the pins in the pin list
            using (MySqlCommand command2 = new MySqlCommand())
            {
                command2.Connection = connection;
                command2.CommandType = CommandType.Text;
                command2.CommandText = "SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";

                MySqlParameter idParameter;

                foreach (Pin pin in pins)
                {
                    //Sets id for current pin
                    idParameter = new MySqlParameter("Id", pin.Id);
                    command2.Parameters.Add(idParameter);

                    using (MySqlDataReader reader2 = command2.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            pin.Tags.Add(reader2.GetInt32(0));
                        }
                    }

                    //Can't rerun query for new pin until old is deleted
                    command2.Parameters.Remove(idParameter);
                }
            }

            connection.Close();

            return pins;
        }

        //Gets pins that have the search bar input string in the street
        public List<Pin> getByCity(string searchString)
        {
            List<Pin> pins = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                //Search the pins table street column for strings with the search string in it.
                //Set all to lower to dismiss case sensitivity
                command.CommandText = @"SELECT id, user_id, longitude, latitude, title, street FROM " + PIN_TABLE + " WHERE(LOWER(street) LIKE LOWER(@SearchString)) LIMIT 100;";
                command.Parameters.AddWithValue("@SearchString", "%" + searchString + "%");

                //Go through and add to pin list
                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Pin pin = new Pin();
                        pin.Id = reader.GetInt32(0);
                        pin.UserId = reader.GetInt32(1);
                        pin.Longitude = reader.GetDouble(2);
                        pin.Latitude = reader.GetDouble(3);
                        pin.Title = reader.GetString(4);
                        pin.Street = reader.GetString(5);

                        pins.Add(pin);
                    }
                }
            }
            //Add tag to the pins in the pin list
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT tag_id FROM " + TAG_TABLE + " WHERE(`pin_id` = @Id);";

                MySqlParameter idParameter;

                foreach (Pin pin in pins)
                {
                    idParameter = new MySqlParameter("Id", pin.Id);
                    command.Parameters.Add(idParameter);

                    using (MySqlDataReader reader2 = command.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            pin.Tags.Add(reader2.GetInt32(0)); //Gets the tag
                        }
                    }
                    command.Parameters.Remove(idParameter); //Don't need id
                }
            }
            connection.Close();
            return pins;
        }

        //Gets the up_vote and down_vote values by pin id, then returns the average
        public int getAverageVote(int pinid)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            int voteDifference = 0;

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT up_vote, down_vote FROM " + PIN_TABLE + " WHERE id=@PinId;";
                command.Parameters.AddWithValue("@PinId", pinid);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        int upVote = reader.GetInt32("up_vote");
                        int downVote = reader.GetInt32("down_vote");
                        voteDifference = upVote - downVote;
                    }
                }

                connection.Close();
            }

            return voteDifference;
        }
    }
}