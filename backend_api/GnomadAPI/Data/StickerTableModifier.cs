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
    //This class updates the Stickers table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getByTagId, getAll, and add.
    //******************************************************************************
    public class StickerTableModifier : IDataRepository<Sticker>
    {
        const string TABLE = "stickers";
        //private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public StickerTableModifier(IConfiguration config)
        {

        }

        public Sticker getById(int id)
        {
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();
            Sticker stickers = null;
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM + " + TABLE + " WHERE(`id` = @Id);";
                command.Parameters.AddWithValue("Id", id);


                using (MySqlDataReader reader = command.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        stickers = new Sticker();
                        stickers.Id = reader.GetInt32(0);
                        stickers.UserId = reader.GetInt32(1);
                        stickers.Longitude = reader.GetInt32(2);
                        stickers.Latitude = reader.GetInt32(3);
                        stickers.Title = reader.GetString(4);
                        stickers.Street = reader.GetString(5);
                    }
                }

                return stickers;
            }
        }

        public List<Sticker> getAll()
        {
            List<Sticker> stickers = new List<Sticker>();
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + ";";


                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Sticker sticker = new Sticker();
                        sticker.Id = reader.GetInt32(0);
                        sticker.UserId = reader.GetInt32(1);
                        sticker.Longitude = reader.GetInt32(2);
                        sticker.Latitude = reader.GetInt32(3);
                        sticker.Title = reader.GetString(4);
                        sticker.Street = reader.GetString(5);
                        stickers.Add(sticker);
                    }
                }
            }

            return stickers;
        }

        public List<Sticker> getAll(int uid)
        {
            List<Sticker> stickers = new List<Sticker>();
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`user_id` = @UId);";
                command.Parameters.AddWithValue("UId", uid);



                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Sticker sticker = new Sticker();
                        sticker.Id = reader.GetInt32(0);
                        sticker.UserId = reader.GetInt32(1);
                        sticker.Longitude = reader.GetInt32(2);
                        sticker.Latitude = reader.GetInt32(3);
                        sticker.Title = reader.GetString(4);
                        sticker.Street = reader.GetString(5);
                        stickers.Add(sticker);
                    }
                }
            }
            return stickers;
        }

        public bool add(Sticker sticker)
        {
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (longitude, latitude, title, street) VALUES (@Longitude, @Latitude, @Title, @Street);";
                command.Parameters.AddWithValue("@Longitude", sticker.Longitude);
                command.Parameters.AddWithValue("@DLatitude", sticker.Latitude);
                command.Parameters.AddWithValue("@Title", sticker.Title);
                command.Parameters.AddWithValue("@Street", sticker.Street);

                command.ExecuteNonQuery();
            }

            return true; //Error handling here.
        }

        public bool contains(Sticker data)
        {

            bool exists = false;
            MySqlConnection connection = TestingDatabaseConnection.getInstance().getConnection();

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

        public List<Sticker> getAllByUser(int uid)
        {
            throw new NotImplementedException();
        }

        public int getId(Sticker data)
        {
            throw new NotImplementedException();
        }
    }
}