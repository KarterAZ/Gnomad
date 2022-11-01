using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;

namespace TravelCompanionAPI.Controllers
{
    [Route("user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("get/{id}")]
        public JsonResult get(int id)
        {
            User user = UserTableModifier.getUserById(id);

            if (user == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(user));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<User> users = UserTableModifier.getAllUsers();

            return new JsonResult(Ok(users));
        }

        [HttpPost("create")]
        public JsonResult create(User user)
        {
            UserTableModifier.addUser(user);

            return new JsonResult(Ok(user));
        }
    }
}
