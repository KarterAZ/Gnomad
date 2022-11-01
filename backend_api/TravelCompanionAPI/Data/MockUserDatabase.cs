using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI.Data
{
    public class MockUserDatabase
    {
        private List<User> _users;

        public MockUserDatabase()
        {
            _users = new List<User>();
        }

        public void addUser(User user)
        {
            _users.Add(user);
        }

        public User getUser(int id)
        {
            foreach (User user in _users)
            {
                if (user.Id == id)
                {
                    return user;
                }
            }
            return null;
        }

        public bool deleteUser(int id)
        {
            User to_remove = null;

            foreach (User user in _users)
            {
                if (user.Id == id)
                {
                    to_remove = user;
                    break;
                }
            }

            if (to_remove == null) return false;

            _users.Remove(to_remove);

            return true;
        }

        public bool containsUser(int id)
        {
            foreach (User user in _users)
            {
                if (user.Id == id)
                {
                    return true;
                }
            }
            return false;
        }

        public User[] getUsers()
        {
            return _users.ToArray();
        }
    }
}
