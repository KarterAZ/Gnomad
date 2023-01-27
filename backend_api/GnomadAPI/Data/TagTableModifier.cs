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

        public TagTableModifier()
        { }

        public Tag getById(int id)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            Tag tag = null;

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM + " + TABLE + " WHERE(`id` = @Id);";
                command.Parameters.AddWithValue("Id", id);

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

            connection.Close();

            return tag;
        }

        public List<Tag> getAll()
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();
            List<Tag> tags = new List<Tag>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + ";";

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

            connection.Close();

            return tags;
        }

        public int add(Tag tag)
        {
            MySqlConnection connection = DatabaseConnection.getInstance().getConnection();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (id, type) VALUES (@ID, @Type);";
                command.Parameters.AddWithValue("@Id", tag.Id);
                command.Parameters.AddWithValue("@Type", tag.Type);

                command.ExecuteNonQuery();
            }

            connection.Close();

            return 0;
        }

        public bool contains(Tag data)
        {
            throw new NotImplementedException();
        }

        public Pin getAllByUser(int uid)
        {
            throw new NotImplementedException();
        }
    }
}