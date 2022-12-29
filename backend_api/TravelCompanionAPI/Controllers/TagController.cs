using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;

namespace TravelCompanionAPI.Controllers
{
    [Route("tags")]
    [ApiController]
    [Authorize]
    public class TagController : ControllerBase
    {
        private IDataRepository<Tag> _repo;
        public TagController(IDataRepository<Tag> repo)
        {
            _repo = repo;
        }

        [HttpGet("get/{id}")]
        public JsonResult get(int id)
        {

            Tag tag = _repo.getById(id);

            if (tag == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(tag));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<Tag> tags = _repo.getAll();

            return new JsonResult(Ok(tags));
        }

        [HttpPost("create")]
        public JsonResult create(Tag tag)
        {
            _repo.add(tag);

            return new JsonResult(Ok(tag));
        }
    }
}
