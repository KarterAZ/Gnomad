/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 1/20/2023
*
* Purpose: Holds the functions for table access.
*
************************************************************************************************/

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using TravelCompanionAPI.Models;
using Microsoft.Extensions.Configuration;
using System.Data;
using H3Lib;
using H3Lib.Extensions;
using System.Diagnostics;
using System.Linq;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the h3_oregon_data table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getByH3Id, getAll
    //******************************************************************************
    public class CellularRepository : ICellularRepository
    {
        const string TABLE = "h3_oregon_data";

//TODO: do we need config?
        public CellularRepository(IConfiguration config)
        {

        }

        public Cellular getByH3Id(string id)
        {
            Cellular cellular = null;

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                //TODO: Fix spelling for environment (this is what it currently is in database)
                command.CommandText = "SELECT technology, mindown, minup, environmnt, h3_res9_id FROM " + TABLE + " WHERE h3_res9_id = @Id";
                command.Parameters.AddWithValue("Id", id);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        cellular = new Cellular();
                        cellular.Technology = reader.GetInt32(0);
                        cellular.Mindown = reader.GetInt32(1);
                        cellular.Minup = reader.GetInt32(2);
                        cellular.Environment = reader.GetInt32(3);
                        cellular.H3id = reader.GetString(4);
                    }
                }
            }

            //command.Connection.Close();

            return cellular;
        }

        public List<Cellular> getAll()
        {
            List<Cellular> h3_oregon_data = new List<Cellular>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                //TODO: Fix spelling for environment (this is what it currently is in database)
                command.CommandText = "SELECT technology, mindown, minup, environmnt, h3_res9_id FROM " + TABLE + " Limit 25 ;";

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Cellular cellular = new Cellular();
                        cellular.Technology = reader.GetInt32(0);
                        cellular.Mindown = reader.GetInt32(1);
                        cellular.Minup = reader.GetInt32(2);
                        cellular.Environment = reader.GetInt32(3);
                        cellular.H3id = reader.GetString(4);
                        h3_oregon_data.Add(cellular);
                    }
                }
            }

            return h3_oregon_data;
        }

        public List<string> getAllH3(int offset)
        {
            List<string> h3_oregon_data = new List<string>();
            offset *= 7500;

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT h3_res9_id FROM " + TABLE + " LIMIT 7500 OFFSET @Offset;";
                command.Parameters.AddWithValue("@Offset", offset);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        String cellular = reader.GetString(0);
                        h3_oregon_data.Add(cellular);
                    }
                }
            }

            return h3_oregon_data;
        }

//TODO: Might go faster if double instead of decimal. Doubt we need THAT much precision?
        public List<decimal> getHexCoords(int pass)
        {
            List<string> h3ids = getAllH3(pass);
            List<decimal> coords = new List<decimal>();
            H3Index h3;
            GeoBoundary geoBounds;
            List<GeoCoord> geoVerts;
            List<H3Index> compactedSet = new List<H3Index>();

            foreach (string id in h3ids)
            {
                h3 = id.ToH3Index();
                compactedSet.Add(h3);
            }

            int res = compactedSet.First().Resolution; //All the same
            //long max = compactedSet.MaxUncompactSize(res);

            //For Todd's eyes only O O
                                   //
            //                     ___
            /*int status;
            (status, List<H3Index> uncompactedSet) = compactedSet.Uncompact(res);*/
            Console.WriteLine(res);
            //Console.WriteLine(status);

            foreach (H3Index h3i in compactedSet)
            {
                geoBounds = h3i.ToGeoBoundary(); //Inefficient
                geoVerts = geoBounds.Verts;

                if(h3i.IsValid())
                {
                    //Pentagons have 5 sides, hexagons have 6.
                    //Pentagons/hexagons are only valid output ;)
                    int forSize = h3i.IsPentagon() ? 5 : 6;

                    for (int i = 0; i < forSize; i++)
                    {
                        coords.Add(geoVerts[i].Latitude.RadiansToDegrees());
                        coords.Add(geoVerts[i].Longitude.RadiansToDegrees());
                    }
                }
                else
                {
                    //Commit war crimes (error checking. Possibly explosions.)
                    Console.WriteLine("An error has occurred. H3 isn't valid.");
                }

                coords.Add(geoVerts[0].Latitude.RadiansToDegrees());
                coords.Add(geoVerts[0].Longitude.RadiansToDegrees());
                geoVerts.Clear();

            }

            //Console.WriteLine(max);

            return coords;
        }
    }
}