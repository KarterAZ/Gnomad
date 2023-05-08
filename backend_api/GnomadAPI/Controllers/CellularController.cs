/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/21/2023
*
* Purpose: Contains Cellular Controllers.
*
************************************************************************************************/

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;

namespace TravelCompanionAPI.Controllers
{
    /// <summary>
    /// Default cellular controller.
    /// </summary>
    [Route("h3_oregon_data")]
    [ApiController]
    public class CellularController : ControllerBase
    {
        //The repository obtained through dependency injection.
        private ICellularRepository _repo;

        public CellularController(ICellularRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("saveToDatabase")]
        public JsonResult saveData()
        {

            _repo.SaveToDatabase();

            return new JsonResult(Ok());
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
        public JsonResult getAllH3()
        {
            List<string> h3List = _repo.getAllH3();

            return new JsonResult(Ok(h3List));
        }

        [HttpGet("allInRange/{latMin}/{lngMin}/{latMax}/{lngMax}")]
        public JsonResult getIdsInRange(float latMin, float lngMin, float latMax, float lngMax)
        {
            List<int> inRange = _repo.getIdsInRange(latMin, lngMin, latMax, lngMax);

            return new JsonResult(Ok(inRange));
        }

        [HttpGet("allCoords/{latMin}/{lngMin}/{latMax}/{lngMax}")]
        public (JsonResult, JsonResult) getAllCoords(float latMin, float lngMin, float latMax, float lngMax)
        {
            (List<float> latList, List<float> lngList) = _repo.getAllCoords(latMin, lngMin, latMax, lngMax);

            return (new JsonResult(Ok(latList)), new JsonResult(Ok(lngList)));
        }

        [HttpGet("allCoordsSingle/{max_pass}/{latMin}/{lngMin}/{latMax}/{lngMax}")]
        public JsonResult getAllCoordsSingle(int max_pass, float latMin, float lngMin, float latMax, float lngMax)
        {
            List<float> latLngList = _repo.getAllCoordsThreaded(max_pass, latMin, lngMin, latMax, lngMax);

            return new JsonResult(Ok(latLngList));
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
