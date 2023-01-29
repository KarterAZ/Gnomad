//Script to add supercharger pins to the database.
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using TravelCompanionAPI.Data;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI.Fuel
{
    static class AddingGasData
    {
        //Adds the relevent data to the database.
        public static void AddGas(IDataRepository<Pin> pin_repo)
        {
            //Get connection string and set up database done in pin_repo (of type PinTableModifier)
            //File I/O
            string path = Path.Join(Directory.GetCurrentDirectory(), "\\Fuel\\AddGasPins\\GasData.txt");

            if (File.Exists(path)) //Only run if file is found (should be found)
            {
                foreach (GasData data in JsonSerializer.Deserialize<List<GasData>>(File.ReadAllText(path)))
                {
                        Pin pin = new Pin();
                        pin.UserId = 0;
                        pin.Longitude = data.geometry.coordinates.Last();
                        pin.Latitude = data.geometry.coordinates.First();
                        pin.Title = data.properties.name;
                        pin.Street = data.properties.addr_housenumber + " " + data.properties.addr_street;

                        if (data.properties.fuel_gasoline == "yes")
                            pin.Tags.Add((int)TagValues.tags.Regular);
                        if (data.properties.fuel_diesel == "yes")
                            pin.Tags.Add((int)TagValues.tags.Diesel);

                        pin_repo.add(pin);
                }
            }
        }
    }
}