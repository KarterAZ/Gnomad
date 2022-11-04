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
    public class UserTableModifier : IDataRepository<User>
    {
        const string TABLE = "users";
        private readonly IConfiguration _config;
        private SqlConnection _connection;

        public UserTableModifier(IConfiguration config)
        {
            _config = config;

            //Switch depending on mode
            //_connection = new SqlConnection(_config.GetConnectionString("CodenomeDatabase"));
            _connection = new SqlConnection(_config.GetConnectionString("TestingDatabase"));
        }

        public User getById(int id)
        {
            User user = null;
            using SqlCommand command = new SqlCommand();
            command.Connection = _connection;
            command.CommandType = CommandType.Text;
            command.CommandText = "SELECT * FROM @Table WHERE(`id` = '@Id');";
            command.Parameters.AddWithValue("Id", id);
            command.Parameters.AddWithValue("Table", TABLE);

            _connection.Open();

            using SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                user = new User();
                user.Id = reader.GetInt32(0);
                user.Email = reader.GetString(1);
                user.DisplayName = reader.GetString(2);
                user.FirstName = reader.GetString(3);
                user.LastName = reader.GetString(4);
            }

            _connection.Close();

            return user;
        }

        public List<User> getAll()
        {
            List<User> users = new List<User>();

            using SqlCommand command = new SqlCommand();
            command.Connection = _connection;
            command.CommandType = CommandType.Text;
            command.CommandText = "SELECT * FROM @Table;";
            command.Parameters.AddWithValue("Table", TABLE);

            _connection.Open();

            using SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                User user = new User();
                user.Id = reader.GetInt32(0);
                user.Email = reader.GetString(1);
                user.DisplayName = reader.GetString(2);
                user.FirstName = reader.GetString(3);
                user.LastName = reader.GetString(4);
                users.Add(user);
            }

            _connection.Close();

            return users;
        }

        public int add(User user)
        {
            using SqlCommand command = new SqlCommand();
            command.Connection = _connection;
            command.CommandType = CommandType.Text;
            command.CommandText = "INSERT INTO @Table (email, display_name, first_name, last_name) VALUES ('@Email', '@DisplayName', '@FirstName', '@LastName');";
            command.Parameters.AddWithValue("Table", TABLE);
            command.Parameters.AddWithValue("Email", user.Email);
            command.Parameters.AddWithValue("DisplayName", user.DisplayName);
            command.Parameters.AddWithValue("FirstName", user.FirstName);
            command.Parameters.AddWithValue("LastName", user.LastName);

            _connection.Open();

            using SqlDataReader reader = command.ExecuteReader();

            command.ExecuteNonQuery();

            _connection.Close();

            return 0;
        }
    }
}
