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
    //Implements getById, getAll, and add.
    //******************************************************************************
    public class StickerTableModifier : IDataRepository<Sticker>
    {
        const string TABLE = "stickers";
        private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public StickerTableModifier(IConfiguration config)
        {
            //Switch depending on mode
            string connection = null;
            //connection = config.GetConnectionString("CodenomeDatabase");
            connection = config.GetConnectionString("TestingDatabase");

            _connection = new MySqlConnection(connection);
        }

        public Sticker getById(int id)
        {
            Sticker stickers = null;
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
                        stickers = new Sticker();
                        stickers.Id = reader.GetInt32(0);
                        stickers.UserId = reader.GetInt32(1);
                        stickers.Longitude = reader.GetInt32(2);
                        stickers.Latitude = reader.GetInt32(3);
                        stickers.Title = reader.GetString(4);
                        stickers.Street = reader.GetString(5);
                    }
                }
            }

            _connection.Close();

            return stickers;
        }

        public List<Sticker> getAll()
        {
            List<Sticker> stickers = new List<Sticker>();

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

            _connection.Close();

            return stickers;
        }

        public List<Sticker> getAllByUser(int uid)
        {
            List<Sticker> stickers = new List<Sticker>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`user_id` = @UId);";
                command.Parameters.AddWithValue("UId", uid);

                _connection.Open();

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

            _connection.Close();

            return stickers;
        }

        public int add(Sticker sticker)
        {
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (longitude, latitude, title, street) VALUES (@Longitude, @Latitude, @Title, @Street);";
                command.Parameters.AddWithValue("@Longitude", sticker.Longitude);
                command.Parameters.AddWithValue("@DLatitude", sticker.Latitude);
                command.Parameters.AddWithValue("@Title", sticker.Title);
                command.Parameters.AddWithValue("@Street", sticker.Street);

                _connection.Open();

                command.ExecuteNonQuery();
            }

            _connection.Close();

            return 0;
        }

        private readonly object _lockObject = new object();
         public bool contains(Sticker data)
         {
            lock (_lockObject)
            {
                bool exists = false;
                using (MySqlCommand command = new MySqlCommand())
                {
                    command.Connection = _connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM " + TABLE + " WHERE longitude = @Longitude AND latitude=@Latitude;";
                    command.Parameters.AddWithValue("@Longitude", pin.Longitude);
                    command.Parameters.AddWithValue("@Latitude", pin.Latitude);
                    _connection.Open();

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (data.longitude == reader.GetString(0) && data.latitude==reader.GetString(1))
                            {
                                exists = true;
                                break;
                            }
                        }
                    }
                }
                _connection.Close();

                return exists;
            }
        }
    }
}