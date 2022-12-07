using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TravelCompanionAPI.Controllers;

/// <summary>
/// The default route controller.
/// </summary>
[Route("")]
[ApiController]
[Authorize]
public class HomeController : Controller
{
    /// <summary>
    /// Test endpoint that returns the name of the logged in user.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult Index()
    {
        var currentUser = User.Identity.Name;
        return Ok($"Current User: {currentUser}");
    }
}
