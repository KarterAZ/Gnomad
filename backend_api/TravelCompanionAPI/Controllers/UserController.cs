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
        //Repo is the list of users in the database
        private IDataRepository<User> _repo;
        public UserController(IDataRepository<User> repo)
        {
            _repo = repo;
        }

        [HttpGet("get/{id}")]
        public JsonResult get(int id)
        {

            User user = _repo.getById(id);

            if (user == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(user));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<User> users = _repo.getAll();

            return new JsonResult(Ok(users));
        }

        [HttpPost("create")]
        public JsonResult create(User user)
        {
            _repo.add(user);

            return new JsonResult(Ok(user));
        }
    }
}
