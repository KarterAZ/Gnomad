/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Validates google oauth tokens.
*
************************************************************************************************/

using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System;
using System.Text.Json;
using TravelCompanionAPI.Models;
using TravelCompanionAPI.Data;

namespace TravelCompanionAPI;

/// <summary>
/// Validates the Google OAuth2 token.
/// </summary>
internal class GoogleTokenValidator : ISecurityTokenValidator
{
    private readonly JwtSecurityTokenHandler _tokenHandler;

    public GoogleTokenValidator()
    {
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    public bool CanValidateToken => true;

    public int MaximumTokenSizeInBytes { get; set; } = TokenValidationParameters.DefaultMaximumTokenSizeInBytes;

    public bool CanReadToken(string securityToken)
    {
        return _tokenHandler.CanReadToken(securityToken);
    }

    public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters, out SecurityToken validatedToken, IDataRepository<User> repo)
    {
        // call googles validate function
        var payload = GoogleJsonWebSignature.ValidateAsync(securityToken, new GoogleJsonWebSignature.ValidationSettings()).Result;

        // initialize the token to null
        validatedToken = null;

        // create the claims list
        var claims = new List<Claim>
        {
            new (ClaimTypes.NameIdentifier, payload.Name),
            new (ClaimTypes.Name, payload.Name),
            new (JwtRegisteredClaimNames.Email, payload.Email),
            new (JwtRegisteredClaimNames.Sub, payload.Subject),
            new (JwtRegisteredClaimNames.Iss, payload.Issuer)

            //Pass in IDataRepository<User>, call _repo.add(new User(ID?, payload.Name, payload.Email, ...));
        };

        // try to read the security token, if successful return the principle
        try
        {
            validatedToken = _tokenHandler.ReadJwtToken(securityToken);
            var principle = new ClaimsPrincipal();
            principle.AddIdentity(new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme));

            User user = new User();
            var current_user = payload.Name.Split(' ');
            user.FirstName = current_user[0];
            user.LastName = current_user[1];
            user.ProfilePhotoURL = payload.Picture;
            //user.Id = ;  //Not needed?
            user.Email = payload.Email;

            if(!repo.contains(user))
            {
                repo.add(user);
            }

            // validation was successful, return the principle
            return principle;
        }
        catch (Exception e)
        {
            // log the problem
            Console.WriteLine(e);
        }

        // validation failed, return null
        return null;
    }
}