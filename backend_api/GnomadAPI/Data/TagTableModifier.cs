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
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.Common;
using System.Data;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the Tags table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getById, getAll, and add.
    //******************************************************************************
    public class TagTableModifier : IDataRepository<Tag>
    {
        const string TABLE = "tags";
        private MySqlConnection _connection;

        /// <summary>
        /// Constructor
        /// </summary>
        public TagTableModifier(IConfiguration config)
        {
            //Switch depending on mode
            string connection = null;
            //connection = config.GetConnectionString("CodenomeDatabase");
            connection = config.GetConnectionString("TestingDatabase");

            _connection = new MySqlConnection(connection);
        }

        /// <summary>
        /// Gets a tag by its id
        /// </summary>
        /// <returns>
        /// A tag with the specified id
        /// </returns>
        public Tag getById(int id)
        {
            Tag tag = null;
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
                        tag = new Tag();
                        tag.Id = reader.GetInt32(0);
                        tag.Type = reader.GetString(1);
                    }
                }
            }

            _connection.Close();

            return tag;
        }

        /// <summary>
        /// Gets all tags
        /// </summary>
        /// <returns>
        /// A list of all Tags
        /// </returns>
        public List<Tag> getAll()
        {
            List<Tag> tags = new List<Tag>();

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
                        Tag tag = new Tag();
                        tag.Id = reader.GetInt32(0);
                        tag.Type = reader.GetString(1);
                        tags.Add(tag);
                    }
                }
            }

            _connection.Close();

            return tags;
        }

        /// <summary>
        /// Adds a tag
        /// </summary>
        /// <returns>
        /// Returns a boolean, true if added to database.
        /// </returns>
        public bool add(Tag tag)
        {
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (id, type) VALUES (@ID, @Type);";
                command.Parameters.AddWithValue("@Id", tag.Id);
                command.Parameters.AddWithValue("@Type", tag.Type);

                _connection.Open();

                command.ExecuteNonQuery();
            }

            _connection.Close();

            return true; //Error handling here.
        }

        /// <summary>
        /// Checks if a tag is in the database
        /// </summary>
        /// <returns>
        /// Returns true if the tag is in the database, else false.
        /// </returns>
        public bool contains(Tag data)
        {
            throw new NotImplementedException();
        }

        public List<Tag> getAllByUser(int uid)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Gets a tag's id based on the data
        /// </summary>
        /// <returns>
        /// Returns the integer of the specified tag
        /// </returns>
        public int getId(Tag data)
        {
            throw new NotImplementedException();
        }
    }
}