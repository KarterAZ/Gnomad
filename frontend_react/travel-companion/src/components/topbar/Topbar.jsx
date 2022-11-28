export default function Topbar() {
  return (
<ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link text-dark" href="/backend_api/TravelCompanionAPI/Areas/Identity/Pages/Account/Register.cshtml" id="register" asp-area="Identity" asp-page="/Account/Register">Register</a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="/backend_api/TravelCompanionAPI/Areas/Identity/Pages/Account/Login.cshtml" id="login" asp-area="Identity" asp-page="/Account/Login">Login</a>
    </li>
</ul>
  );
}
