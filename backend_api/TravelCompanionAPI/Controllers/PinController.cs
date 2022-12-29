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
    [Route("pins")]
    [ApiController]
    [Authorize]
    public class PinController : ControllerBase
    {
        private IDataRepository<Pin> _repo;
        public PinController(IDataRepository<Pin> repo)
        {
            _repo = repo;
        }

        [HttpGet("get/{id}")]
        public JsonResult get(int id)
        {

            Pin pin = _repo.getById(id);

            if (pin == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(pin));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<Pin> pins = _repo.getAll();

            return new JsonResult(Ok(pins));
        }

        [HttpGet("get/{user}")]
        public JsonResult get(int uid)
        {

            Pin pin = _repo.getAllByUser(uid);

            if (pin == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(pin));
        }

        [HttpPost("create")]
        public JsonResult create(Pin pin)
        {
            _repo.add(pin);

            return new JsonResult(Ok(pin));
        }
    }
}
