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
    //This class updates the PinTags table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getByPinId, getByTagId, getAll, and add.
    //******************************************************************************
    public class PinTagTableModifier : IDataRepository<PinTag>
    {
        const string TABLE = "pintags";
        private MySqlConnection _connection;
        //Connection strings should be in secrets.json. Check out the resources tab in Discord to update yours (or ask Andrew).

        public PinTagTableModifier(IConfiguration config)
        {
            //Switch depending on mode
            string connection = null;
            //connection = config.GetConnectionString("CodenomeDatabase");
            connection = config.GetConnectionString("TestingDatabase");

            _connection = new MySqlConnection(connection);
        }

        public List<PinTag> getByPinId(int pid)
        {
            List<PinTag> pintags = new List<PinTag>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`pin_id` = @Pid);";
                command.Parameters.AddWithValue("@Pid", pid);

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PinTag pintag = new PinTag();
                        pintag.PinId = reader.GetInt32(0);
                        pintag.TagId = reader.GetInt32(1);
                        pintagtags.Add(pintag);
                    }
                }
            }

            _connection.Close();

            return pintags;
        }

        public List<PinTag> getByTagId(int tid)
        {
            List<PinTag> pintags = new List<PinTag>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " WHERE(`tag_id` = @Tid);";
                command.Parameters.AddWithValue("@Tid", tid);

                _connection.Open();

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PinTag pintag = new PinTag();
                        pintag.PinId = reader.GetInt32(0);
                        pintag.TagId = reader.GetInt32(1);
                        pintagtags.Add(pintag);
                    }
                }
            }

            _connection.Close();

            return pintags;
        }

        public List<PinTag> getAll()
        {
            List<PinTag> pintags = new List<PinTag>();

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
                        PinTag pintag = new PinTag();
                        pintag.PinId = reader.GetInt32(0);
                        pintag.TagId = reader.GetInt32(1);
                        pintags.Add(pintag);
                    }
                }
            }

            _connection.Close();

            return pintagtags;
        }

        public int add(PinTag pintag)
        {
            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = _connection;
                command.CommandType = CommandType.Text;
                command.CommandText = "INSERT INTO " + TABLE + " (pin_id, tag_id) VALUES (@PiD, @Tid);";
                command.Parameters.AddWithValue("@Pid", pintag.PinId);
                command.Parameters.AddWithValue("@Tid", pintag.TagId);

                _connection.Open();

                command.ExecuteNonQuery();
            }

            _connection.Close();

            return 0;
        }
    }
}