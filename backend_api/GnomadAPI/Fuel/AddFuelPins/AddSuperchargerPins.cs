//Script to add supercharger pins to the database.
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using TravelCompanionAPI.Data;
using TravelCompanionAPI.Models;

//Adds the relevent data to the database.
void AddSuperchargers(IDataRepository<Pin> pin_repo)
{
    //Get connection string and set up database done in pin_repo (of type PinTableModifier)
    //File I/O
    string path = @"..\FuelData\SuperchargerData.txt";

    if (File.Exists(path)) //Only run if file is found (should be found)
    {
        foreach(SuperchargerData data in JsonSerializer.Deserialize<List<SuperchargerData>>(File.ReadAllText(path)))
        {
            if (data.address["country"].country.Equals("USA") && data.status.Equals("OPEN")) //If an open us supercharger
            {
                Pin pin = new Pin();
                pin.UserId = 0;
                pin.Longitude = data.gps["longitude"].longitude;
                pin.Latitude = data.gps["latitude"].latitude;
                pin.Title = data.name + " Supercharger";
                pin.Street = data.address["street"].street;
                pin.Tags.Add();

                pin_repo.add(pin);
            }
        }
    }
}