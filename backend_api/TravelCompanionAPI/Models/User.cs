using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelCompanionAPI.Models
{
    public class User
    {
        public User()
        { }

        public User(string email, string display_name, string first_name, string last_name)
        {
            Id = -1;
            Email = email;
            DisplayName = display_name;
            FirstName = first_name;
            LastName = last_name;
        }
        public int Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public void print()
        {
            Console.WriteLine(
                "id: {0}\nemail: {1}\ndisplay name: {2}\nfirst name: {3}\nlast name: {4}"
                , Id, Email, DisplayName, FirstName, LastName);
        }
    }
}
