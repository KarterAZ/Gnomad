/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 12/28/2022
*
* Purpose: Not needed, but holds the functions for table modifications and access.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using TravelCompanionAPI.Models;
using System.Data;

//TODO: Implement correctly, update, and comment.
//Do things like remove the * from SELECT statements
//And only get the stickers, verifying the correct user
namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the Stickers table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getByTagId, getAll, and add.
    //******************************************************************************
    public class StickerRepository// : IPinRepository
    {
        /*const string TABLE = "stickers"; //TODO: Is this correct? Are they separate from pins?

        public StickerRepository()
        { }

        public Pin getById(int id)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            List<Pin> stickers = new List<Pin>();

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
                        Pin sticker = new Pin();
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

            connection.Close();
            return stickers;
        }

        public List<Pin> getAll()
        {
            List<Pin> stickers = new List<Pin>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

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

            connection.Close();
            return stickers;
        }

        public List<Sticker> getAll(int uid)
        {
            List<Sticker> stickers = new List<Sticker>();
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

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
            connection.Close();
            return stickers;
        }

        public bool add(Sticker sticker)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

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
            connection.Close();
            return true; //Error handling here.
        }

        public bool contains(Sticker data)
        {

            bool exists = false;
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

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
            connection.Close();
            return exists;
        }

        //TODO: Implement these functions
        //TODO: Comment this doc
        //TODO: Make sure this doc is up to date.
        public List<Sticker> getAllByUser(int uid)
        {
            throw new NotImplementedException();
        }

        public int getId(Sticker data)
        {
            throw new NotImplementedException();
        }

        public List<Pin> getAllInArea(double latStart, double longStart, double latRange, double longRange)
        {
            throw new NotImplementedException();
        }

        public List<Pin> getAllByTag(List<int> tags)
        {
            throw new NotImplementedException();
        }

        Pin IPinRepository.getById(int id)
        {
            throw new NotImplementedException();
        }

        public int getId(Pin data)
        {
            throw new NotImplementedException();
        }

        List<Pin> IPinRepository.getAll()
        {
            throw new NotImplementedException();
        }

        public bool add(Pin data)
        {
            throw new NotImplementedException();
        }

        public bool contains(Pin data)
        {
            throw new NotImplementedException();
        }

        List<Pin> IPinRepository.getAllByUser(int uid)
        {
            throw new NotImplementedException();
        }*/
    }
}