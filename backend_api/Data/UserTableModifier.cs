﻿/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Holds the functions for table modifications and access.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System.Collections.Generic;
using TravelCompanionAPI.Models;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //
    // This class updates the User table, inheriting from IDataRepository.
    // No new methods added.
    // Implements getById, getAll, and add.
    //
    //******************************************************************************
    public class UserTableModifier : IDataRepository<User>
    {
        const string TABLE = "users";
        private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public UserTableModifier(IConfiguration config)
        {
            //Switch depending on mode
            string connection = null;
            //connection = config.GetConnectionString("CodenomeDatabase");
            connection = config.GetConnectionString("TestingDatabase");

            _connection = new MySqlConnection(connection);
        }

        private readonly object _lock = new object();

        public User getById(int id)
        {
            lock (_lock)
            {
                User user = null;
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = _connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE id = @Id;";
                    command.Parameters.AddWithValue("@Id", id);

                    _connection.Open();

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            user = new User();
                            user.Id = reader.GetInt32(0);
                            user.Email = reader.GetString(1);
                            user.ProfilePhotoURL = reader.GetString(2);
                            user.FirstName = reader.GetString(3);
                            user.LastName = reader.GetString(4);
                        }
                    }
                }

                _connection.Close();

                return user;
            }
        }

        public int getId(User user)
        {
            int id = -1;
            lock (_lock)
            {
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = _connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE email = @Email;";
                    command.Parameters.AddWithValue("@Email", user.Email);
                    _connection.Open();

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            id = reader.GetInt32(0);
                        }
                    }
                }

                _connection.Close();
            }

            return id;
        }

        public List<User> getAll()
        {
            lock (_lock)
            {
                List<User> users = new List<User>();

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
                            User user = new User();
                            user.Id = reader.GetInt32(0);
                            user.Email = reader.GetString(1);
                            user.ProfilePhotoURL = reader.GetString(2);
                            user.FirstName = reader.GetString(3);
                            user.LastName = reader.GetString(4);
                            users.Add(user);
                        }
                    }
                }

                _connection.Close();

                return users;
            }
        }

        //TODO: fix this function, this code needs some work.
        public bool contains(User user)
        {
            bool contains = false;
            lock (_lock)
            {
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = _connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT COUNT(*) FROM " + TABLE + " WHERE email = @Email;";
                    command.Parameters.AddWithValue("@Email", user.Email);
                    _connection.Open();

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (reader.GetInt32(0) == 1)
                            {
                                contains = true;
                            }
                        }
                    }
                }
                _connection.Close();
            }

            return contains;
        }

        public int add(User user)
        {
            lock (_lock)
            {
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = _connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = "INSERT INTO " + TABLE + " (email, profile_photo_url, first_name, last_name) VALUES (@Email, @ProfilePhotoURL, @FirstName, @LastName);";
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@ProfilePhotoURL", user.ProfilePhotoURL);
                    command.Parameters.AddWithValue("@FirstName", user.FirstName);
                    command.Parameters.AddWithValue("@LastName", user.LastName);

                    _connection.Open();

                    command.ExecuteNonQuery();
                }

                _connection.Close();

                return 0;
            }
        }

        public Pin getAllByUser(int uid)
        {
            throw new System.NotImplementedException();
        }
    }
}
