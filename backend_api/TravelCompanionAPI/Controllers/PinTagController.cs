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
    [Route("pintags")]
    [ApiController]
    [Authorize]
    public class PinTagController : ControllerBase
    {
        private IDataRepository<PinTag> _repo;
        public PinTagController(IDataRepository<PinTag> repo)
        {
            _repo = repo;
        }

        [HttpGet("get/{pin_id}")]
        public JsonResult get(int pid)
        {

            PinTag pintag = _repo.getByPinId(pid);

            if (pintag == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(pintag));
        }

        [HttpGet("get/{tag_id}")]
        public JsonResult get(int tid)
        {

            PinTag pintag = _repo.getByTagId(tid);

            if (pintag == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(pintag));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<PinTag> pintags = _repo.getAll();

            return new JsonResult(Ok(pintags));
        }

        [HttpPost("create")]
        public JsonResult create(PinTag pintag)
        {
            _repo.add(pintag);

            return new JsonResult(Ok(pintag));
        }
    }
}
