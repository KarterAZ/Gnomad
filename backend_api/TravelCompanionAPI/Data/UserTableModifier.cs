using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI.Data
{
    public class UserTableModifier
    {
        const string TABLE = "users";
        private static DatabaseConnection _database = DatabaseConnection.getInstance();

        public static User getUserById(int id)
        {
            User user = null;
            string query = String.Format("SELECT * FROM {0} WHERE(`id` = '{1}');", TABLE, id);

            var reader = _database.runQuery(query);

            while (reader.Read())
            {
                user = new User();
                user.Id = reader.GetInt32(0);
                user.Email = reader.GetString(1);
                user.DisplayName = reader.GetString(2);
                user.FirstName = reader.GetString(3);
                user.LastName = reader.GetString(4);
            }

            _database.closeConnection();

            return user;
        }

        public static List<User> getAllUsers()
        {
            List<User> users = new List<User>();

            string query = String.Format("SELECT * FROM {0};", TABLE);

            var reader = _database.runQuery(query);

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

            _database.closeConnection();

            return users;
        }

        public static int addUser(User user)
        {
            string query = String.Format
            (
                "INSERT INTO {0} (email, display_name, first_name, last_name) VALUES ('{1}', '{2}', '{3}', '{4}')",
                TABLE,
                user.Email,
                user.DisplayName,
                user.FirstName,
                user.LastName
            );

            _database.runNonQuery(query);
            _database.closeConnection();
            return 0;
        }
    }
}
