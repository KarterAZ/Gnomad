/************************************************************************************************
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
        // private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public UserTableModifier(IConfiguration config)
        {
         //Switch depending on mode
         // string connection = null;
         //connection = config.GetConnectionString("CodenomeDatabase");
         //    connection = config.GetConnectionString("TestingDatabase");
         //   _connection = new MySqlConnection(connection);
        }

    
        public User getById(int id)
        {
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();
                User user = null;
                using (MySqlCommand command = new MySqlCommand())
                {
                
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE id = @Id;";
                    command.Parameters.AddWithValue("@Id", id);

                   // _connection.Open();
                    
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
                
                // _connection.Close();
                DatabaseConnection.getInstance().closeConnection(connection);

                return user;
            
        }

        public List<User> getAll()
        {
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();
                List<User> users = new List<User>();

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + ";";

                    //_connection.Open();

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

                DatabaseConnection.getInstance().closeConnection(connection);

               // _connection.Close();
                 return users;
            
        }

       
        public bool contains(User user)
        {
                bool exists = false;
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT COUNT(*) FROM " + TABLE + " WHERE email = @Email;";
                    command.Parameters.AddWithValue("@Email",user.Email);
                    

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.GetInt32() != 0) //Should be 1, but checks if in database.
                        {
                            exists = true;
                            break;
                        }
                    }
                }
                DatabaseConnection.getInstance().closeConnection(connection);


                return exists;
        }

        public void add(User user)
        {
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = "INSERT INTO " + TABLE + " (email, profile_photo_url, first_name, last_name) VALUES (@Email, @ProfilePhotoURL, @FirstName, @LastName);";
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@ProfilePhotoURL", user.ProfilePhotoURL);
                    command.Parameters.AddWithValue("@FirstName", user.FirstName);
                    command.Parameters.AddWithValue("@LastName", user.LastName);

                 
                    command.ExecuteNonQuery();
                }

                DatabaseConnection.getInstance().closeConnection(connection);
            
        }
    }
}