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

        public Pin(string type)
        {
            Id = -1;
            Type = type;
        }
        [BindNever] //User shouldn't be able to change Id
        public int Id { get; set; }
        public string Type { get; set; }

        public void print()
        {
            Console.WriteLine(
                "id: {0}\ntype: {1}", Id, Type);
        }
    }
}
