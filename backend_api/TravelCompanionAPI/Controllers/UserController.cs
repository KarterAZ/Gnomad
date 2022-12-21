/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Contains User Controllers.
*
************************************************************************************************/

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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

        [HttpPost("create")]
        public async Task<JsonResult> create()
        {
            // parse the users first and last name
            var current_user = User.Identity.Name.Split(' ');
            var first_name = current_user[0];
            var last_name = current_user[1];

            //TODO: finish whatever this is

            // get the user email address
            var email = "bogus, someone else do this.";

            // get the user profile photo url
            var profile_photo_url = "http://thisgoesnowhere.com";

            User user = new User(email, profile_photo_url, first_name, last_name);

            if (!_user_database.contains(user))
            {
                // add the user to the database
                _user_database.add(user);
            }

            // return the user as a json result with the 200 status code
            return new JsonResult(Ok(user));
        }
    }
}
