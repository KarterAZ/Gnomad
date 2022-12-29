using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelCompanionAPI.Extras
{
    public class Utilities
    {
        public static string parseToken(HttpRequest request)
        {
            try
            {
                var token = request.Headers["Authorization"].ToString();
                Console.WriteLine(token);
                return token;
            }
            catch (Exception)
            { 
                // token was not specified
            }
            return null;
        }
    }
}
