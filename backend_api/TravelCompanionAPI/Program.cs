using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
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

        public static IHostBuilder createHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}