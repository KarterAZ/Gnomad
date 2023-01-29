/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 12/28/2022
*
* Purpose: Contains Pin Controllers.
*
************************************************************************************************/

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;

namespace TravelCompanionAPI.Controllers
{
    /// <summary>
    /// The default route controller.
    /// </summary>
    [Route("pins")]
    [ApiController]
    [Authorize]
    public class PinController : ControllerBase
    {
        //The repository obtained through dependency injection.
        private IDataRepository<Pin> _pin_repo;
        private IDataRepository<PinTag> _tag_repo;

        /// <summary>
        /// Constructor that takes in repo through dependecy injection
        /// </summary>
        /// <returns>
        /// Sets repository to PinTableModifier (defined in setup.cs)
        ///</returns>
        public PinController(IDataRepository<Pin> pin_repo,IDataRepository<PinTag> tag_repo)
        {
            _pin_repo = pin_repo;
            _tag_repo = tag_repo;
        }

        /// <summary>
        /// Gets a pin based on the pin's id.
        /// </summary>
        /// <returns>
        /// Returns a JsonResult of NotFound() if it's not found or 
        ///Ok(pin) with the pin found.
        ///</returns>
        [HttpGet("get/{id}")]
        public JsonResult get(int id)
        {

            Pin pin = _pin_repo.getById(id);

            if (pin == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(pin));
        }

        /// <summary>
        /// Gets all of the pins in the database.
        /// </summary>
        /// <returns>
        /// Returns a JsonResult of Ok(pins) where pins is a list of every pin.
        ///</returns>
        [HttpGet("all")]
        public JsonResult getAll()
        {
            List<Pin> pins = _pin_repo.getAll();

            return new JsonResult(Ok(pins));
        }

        /// <summary>
        /// Gets all of the pins that a specific user has placed.
        /// </summary>
        /// <returns>
        /// Returns a JsonResult of NotFound() if no pins, or Ok(pins) if there are pins.
        ///</returns>
        [HttpGet("getPins/{user}")]
        public JsonResult getPins(int uid)
        {

            List<Pin> pins = _pin_repo.getAllByUser(uid);

            if (pins == null)
            {
                return new JsonResult(NotFound());
            }

            return new JsonResult(Ok(pins));
        }

        /// <summary>
        /// Creates a pin.
        /// </summary>
        /// <returns>
        /// Returns a JsonResult of Ok(pin), where the pin is the one added to the database.
        ///</returns>
        [HttpPost("create")]
        public JsonResult create(Pin pin)
        {
            _pin_repo.add(pin);

            return new JsonResult(Ok(pin));
        }
    }
}
