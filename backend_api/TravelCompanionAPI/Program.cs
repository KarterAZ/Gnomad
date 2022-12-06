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
            //Adds dependency injection so that UserTableModifier gets called wherever IDataRepository gets called
            .ConfigureServices((_, services) => services.AddTransient<IDataRepository<User>, UserTableModifier>())
            //Adds dependency injection so that PinTableModifier gets called wherever IDataRepository gets called
            .ConfigureServices((_, services) => services.AddTransient<IDataRepository<Pin>, PinTableModifier>())
            //Adds a singleton to UserTableModifier
            .ConfigureServices((_, services) => services.AddSingleton<UserTableModifier>())
            //Adds a singleton to PinTableModifier
            .ConfigureServices((_, services) => services.AddSingleton<PinTableModifier>())
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}