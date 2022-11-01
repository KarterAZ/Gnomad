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
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private MockUserDatabase db = Program.userDatabase;

        [HttpGet]
        public JsonResult Get(int id)
        {
            User user = db.getUser(id);

            if (user == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(user));
        }

        [HttpPost]
        public JsonResult Create(User user)
        {
            if (db.containsUser(user.Id)) return new JsonResult(Ok(user));

            db.addUser(user);

            return new JsonResult(Ok(user));
        }
    }
}
