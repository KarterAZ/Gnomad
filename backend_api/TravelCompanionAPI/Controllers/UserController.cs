using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public JsonResult Get(int id)
        {
            User user = Program.userDatabase.getUser(id);

            if (user == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(user));
        }

        [HttpPost]
        public JsonResult Create(User user)
        {
            if (Program.userDatabase.containsUser(user.Id)) return new JsonResult(Ok(user));

            Program.userDatabase.addUser(user);

            return new JsonResult(Ok(user));
        }
    }
}
