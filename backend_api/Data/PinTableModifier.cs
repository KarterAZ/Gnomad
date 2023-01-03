using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using TravelCompanionAPI.Models;
using Microsoft.Extensions.Configuration;
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
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public PinTableModifier(IConfiguration config)
        {
           
        }

        

        public Pin getById(int id)
        {

                Pin pins = null;
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();
 
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = "SELECT * FROM " + TABLE + " WHERE(`id` = @Id);";
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
                }

                return pins;
            
        }

        public List<Pin> getAll()
        {

                List<Pin> pins = new List<Pin>();
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + ";";


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
                }

                return pins;
        }

        public List<Pin> getAllByUser(int uid)
        {
            
                List<Pin> pins = new List<Pin>();
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`user_id` = @Uid);";
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
                }
                
                
                return pins;
            
        }

        public void add(Pin pin)
        {
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = "INSERT INTO " + TABLE + " (user_id, longitude, latitude, title, street) VALUES (@userID, @Longitude, @Latitude, @Title, @Street);";
                    command.Parameters.AddWithValue("@userId", pin.UserId);
                    command.Parameters.AddWithValue("@Longitude", pin.Longitude);
                    command.Parameters.AddWithValue("@Latitude", pin.Latitude);
                    command.Parameters.AddWithValue("@Title", pin.Title);
                    command.Parameters.AddWithValue("@Street", pin.Street);

                    command.ExecuteNonQuery();
                }
   
        }

         public bool contains(Pin data)
         {    
                bool exists = false;
                MySqlConnection connection =  DatabaseConnection.getInstance().getConnection();

                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE longitude = @Longitude AND latitude=@Latitude;";
                    command.Parameters.AddWithValue("@Longitude", data.Longitude);
                    command.Parameters.AddWithValue("@Latitude", data.Latitude);
                    

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (data.Longitude == reader.GetString(0) && data.Latitude==reader.GetString(1))
                            {
                                exists = true;
                                break;
                            }
                        }
                    }
                }

                return exists;

        }
    }
}