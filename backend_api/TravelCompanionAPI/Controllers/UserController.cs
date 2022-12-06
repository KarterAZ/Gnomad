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
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;
using TravelCompanionAPI.Extras;

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
        public async Task<JsonResult> create(User user)
        {
            /*string token = Utilities.parseToken(Request);
            Identity id = new Identity(token);

            if (await id.validateAsync())
            {
                return new JsonResult(Ok(user));
            }*/

            _repo.add(user);

            return new JsonResult(Ok(user));

            //return new JsonResult(Ok("Authentication Failed"));
        }
    }
}
