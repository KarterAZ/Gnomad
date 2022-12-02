using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Data;

namespace TravelCompanionAPI.Models
{
    public class Pin : IDataEntity
    {
        public Pin()
        { }

        public Pin(int longitude, int latitude, string title)
        {
            Id = -1;
            Longitude = longitude;
            Latitude = latitude;
            Title = title;
        }
        [BindNever] //User shouldn't be able to change Id
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Longitude { get; set; }
        public int Latitude { get; set; }
        public string Title { get; set; }
        public string Tag { get; set; }     //make pin collection class for multiple nearby pins
        public string Street { get; set; }

        public void print()
        {
            Console.WriteLine(
                "id: {0}\nlongitude: {1}\nlatitude name: {2}\ntitle: {3}\nstreet: {4}", Id, Longitude, Latitude, Title, Street);
        }
    }
}
