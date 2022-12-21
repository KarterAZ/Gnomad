/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Where main lives (nice and cozy)
*
************************************************************************************************/

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Data;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            createHostBuilder(args).Build().Run();
        }

        //Sets up the program for Main.
        public static IHostBuilder createHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}