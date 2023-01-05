/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Contains User Controllers.
*
************************************************************************************************/

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;
using TravelCompanionAPI.Extras;

namespace TravelCompanionAPI.Controllers
{
    [Route("user")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        //Repo is the list of users in the database
        private IDataRepository<User> _user_database;
        public UserController(IDataRepository<User> repo)
        {
            _user_database = repo;
        }

        [HttpGet("get/{id}")]
        public JsonResult get(int id)
        {
            User user = _user_database.getById(id);

            if (user == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(user));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            // get a list of all the users from the database (could be very slow, don't actually use)
            List<User> users = _user_database.getAll();

            // return the list of users as a JSON object.
            return new JsonResult(Ok(users));
        }

        [HttpPost("login")]
        public JsonResult login()
        {
            // create local variable for the user id and user
            int id = User.Identity.ID;

            // check if user exists, if not create them, if so return them from the database
            if (_user_database.contains(user))
            {
                user = _user_database.getById(id);
            }
            else
            {
                // user doesn't exist
                // parse their name and other data then insert them into the database;
                var full_name = User.Identity.Name;

                var email = User.Identity.Email;
                var profile_photo_URL = "";
                var first_name = Utilities.parseFirstName(full_name);
                var last_name = Utilities.parseLastName(full_name);


                user = new User(email, profile_photo_URL, first_name, last_name);
            }

            return new JsonResult(Ok(user));
        }
    }
}
