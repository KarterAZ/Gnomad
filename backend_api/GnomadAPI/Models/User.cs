/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Class for User object. Contains definition of User object for use elsewhere.
*
************************************************************************************************/


using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TravelCompanionAPI.Extras;

namespace TravelCompanionAPI.Models
{
    public class User
    {
        public User()
        { }

        public User(string email, string profile_photo_URL, string first_name, string last_name)
        {
            Id = -1;
            Email = email;
            ProfilePhotoURL = profile_photo_URL;
            FirstName = first_name;
            LastName = last_name;
        }

        public User(ClaimsIdentity identity)
        {
            Id = -1;
            Email = identity.FindFirst(JwtRegisteredClaimNames.Email).Value;
            ProfilePhotoURL = "";

            var full_name =identity.Name;
            FirstName = Utilities.parseFirstName(full_name);
            LastName = Utilities.parseLastName(full_name);
        }

        [BindNever] //User shouldn't be able to change Id
        public int Id { get; set; }
        public string Email { get; set; }
        public string ProfilePhotoURL { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public void print()
        {
            Console.WriteLine(
                "id: {0}\nemail: {1}\nprofile photo url: {2}\nfirst name: {3}\nlast name: {4}"
                , Id, Email, ProfilePhotoURL, FirstName, LastName);
        }
    }
}
