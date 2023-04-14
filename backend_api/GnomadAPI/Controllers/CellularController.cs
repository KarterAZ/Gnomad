/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/21/2023
*
* Purpose: Contains Cellular Controllers.
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
using H3Lib;

namespace TravelCompanionAPI.Controllers
{
    /// <summary>
    /// Default cellular controller.
    /// </summary>
    [Route("h3_oregon_data")]
    [ApiController]
    [Authorize]
    public class CellularController : ControllerBase
    {
        //The repository obtained through dependency injection.
        private ICellularRepository _repo;

        public CellularController(ICellularRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("getById")]
        public JsonResult get(string id)
        {

            Cellular cellular = _repo.getByH3Id(id);

            if (cellular == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(cellular));
        }

        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<Cellular> cellularList = _repo.getAll();

            return new JsonResult(Ok(cellularList));
        }

        [HttpGet("allH3Id/{offset}")]
        public JsonResult getAllH3(int offset)
        {
            List<string> h3List = _repo.getAllH3(offset);

            return new JsonResult(Ok(h3List));
        }

        [HttpGet("allInRange/{latMin, lngMin, latMax, lngMax}")]
        public JsonResult getIdsInRange(float latMin, float lngMin, float latMax, float lngMax)
        {
            List<int> inRange = _repo.getIdsInRange(latMin, lngMin, latMax, lngMax);

            return new JsonResult(Ok(inRange));
        }

        [HttpGet("allH3Id/{offset}")]
        public (JsonResult, JsonResult) getAllCoords()
        {
            (List<float> latList, List<float> lngList) = _repo.getAllCoords();

            return (new JsonResult(Ok(latList)), new JsonResult(Ok(lngList)));
        }

        [HttpGet("allHexCoords/{pass}")]
        public JsonResult getHexCoords(int pass)
        {
            List<decimal> h3List = _repo.getHexCoords(pass);

            decimal[] h3Array = h3List.ToArray();

            return new JsonResult(Ok(h3Array));
        }
    }
}
