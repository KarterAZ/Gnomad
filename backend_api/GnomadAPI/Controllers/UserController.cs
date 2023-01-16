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
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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
            var identity = (User.Identity as ClaimsIdentity);

            User user = new User(identity);

            if (!_user_database.contains(user))
            {
                _user_database.add(user);
            }

            // get the user id and return user
            user.Id = _user_database.getId(user);

            return new JsonResult(Ok(user));
        }
    }
}
