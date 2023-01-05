/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Holds the functions for utilities
*
************************************************************************************************/

using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelCompanionAPI.Extras
{
    public class Utilities
    {
        public static string parseFirstName(string full_name)
        {
            string first_name = full_name;

            if (!first_name.Contains(" ")) return first_name;

            var names = first_name.Split(' ');
            if (names.Length <= 1) return first_name;

            first_name = names[0];

            return first_name;
        }

        public static string parseLastName(string full_name)
        {
            string last_name = "";

            if (!full_name.Contains(" ")) return last_name;

            var names = full_name.Split(' ');
            if (names.Length <= 1) return last_name;

            last_name = names[1];

            return last_name;
        }
    }
}
