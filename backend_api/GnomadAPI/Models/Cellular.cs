/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/20/2023
*
* Purpose: Class definition for cellular data
*
************************************************************************************************/

using System;

namespace TravelCompanionAPI.Models
{
    public class Cellular
    {
        public Cellular()
        { }

        public Cellular(int technology, int mindown, int minup, int environment, string h3id)
        {
            Technology = technology;
            Mindown = mindown;
            Minup = minup;
            Environment = environment;
            H3id = h3id;
        }

        public int Technology { get; set; }
        public int Minup { get; set; }
        public int Mindown { get; set; }
        public int Environment { get; set; }
        public string H3id { get; set; }

        public void print()
        {
            Console.WriteLine(
                "Technology: {0}\nMindown: {1}\nMinup: {2}\nEnvironment: {3}\nH3id: {4}\n", Technology, Mindown, Minup, Environment, H3id);
        }
    }
}
