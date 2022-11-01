using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Data;
using System.Diagnostics;

namespace TravelCompanionAPI
{
    public class Program
    {
        private static DatabaseConnection db = TestingDatabaseConnection.getInstance();
        public static void Main(string[] args)
        {
            testDatabaseConnection();
            createHostBuilder(args).Build().Run();
        }

        public static void testDatabaseConnection()
        {
            if (db.isConnected())
            {
                Console.WriteLine("Connected!");
            }
            else
            {
                Console.WriteLine("Not Connected :(");
            }
        }

        public static IHostBuilder createHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
