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
    /// Default route controller.
    /// </summary>
    [Route("h3_oregon_data")]
    [ApiController]
    [Authorize]
    public class CellularController : ControllerBase
    {
        //The repository obtained through dependency injection.
        private ICellDataRepository<Cellular> _repo;

        public CellularController(ICellDataRepository<Cellular> repo)
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

        [HttpGet("allH3Id")]
        public JsonResult getAllH3()
        {
            List<string> h3List = _repo.getAllH3();

            return new JsonResult(Ok(h3List));
        }

        [HttpGet("allCoords")]
        public JsonResult getCoords()
        {
            List<Tuple<decimal, decimal>> h3List = _repo.getCoords();

            Tuple<decimal,decimal>[] h3Array = h3List.ToArray();

            return new JsonResult(Ok(h3Array));
        }

        [HttpGet("allHexCoords")]
        public JsonResult getHexCoords()
        {
            List<decimal> h3List = _repo.getHexCoords();

            decimal[] h3Array = h3List.ToArray();

            return new JsonResult(Ok(h3Array));
        }

        [HttpGet("allLatCoords")]
        public JsonResult getCoordsLat()
        {
            decimal[] h3List = _repo.getCoordsLat();

            return new JsonResult(Ok(h3List));
        }

        [HttpGet("allLngCoords")]
        public JsonResult getCoordsLng()
        {
            decimal[] h3List = _repo.getCoordsLng();

            return new JsonResult(Ok(h3List));
        }
    }
}
