﻿/************************************************************************************************
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
using System.Data;
using H3Lib;
using H3Lib.Extensions;
using System.Threading;

namespace TravelCompanionAPI.Data
{
    //TODO: Delete extra functions? Extra table?
    //******************************************************************************
    //This class updates the h3_oregon_data table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getByH3Id, getAll
    //******************************************************************************
    public class CellularRepository : ICellularRepository
    {
        const string COORDTABLE = "oregon_cellular_coords";

        public CellularRepository()
        {}

        public void SaveToDatabase(string state)
        {
            List<string> h3ids = getAllH3(state);
            List<double> coords = new List<double>();
            H3Index h3;
            GeoBoundary geoBounds;
            GeoCoord center;
            List<GeoCoord> geoVerts;
            List<H3Index> compactedSet = new List<H3Index>();

            //Compacted set means fewest possible hex/pentagaons to fill area perfectly
            foreach (string id in h3ids)
            {
                h3 = id.ToH3Index();
                compactedSet.Add(h3);
            }

            foreach (H3Index h3i in compactedSet)
            {
                if (h3i.IsValid())
                {
                    center = h3i.ToGeoCoord();
                    geoBounds = h3i.ToGeoBoundary();
                    geoVerts = geoBounds.Verts;
                
                    //Pentagons have 5 sides, hexagons have 6.
                    //Pentagons/hexagons are only valid output ;)
                    int forSize = h3i.IsPentagon() ? 5 : 6;

                    for (int i = 0; i < forSize; i++)
                    {
                        coords.Add((double)geoVerts[i].Latitude.RadiansToDegrees());
                        coords.Add((double)geoVerts[i].Longitude.RadiansToDegrees());
                    }

                    //Add line to database
                    using (MySqlCommand command = new MySqlCommand())
                    {
                        command.Connection = DatabaseConnection.getInstance().getConnection();
                        command.CommandType = CommandType.Text;

                        command.CommandText = "INSERT INTO " + COORDTABLE + " VALUES(0, @centerLatitude, @centerLongitude, @latitude1, @longitude1, @latitude2, @longitude2, @latitude3, @longitude3, @latitude4, @longitude4, @latitude5, @longitude5, @latitude6, @longitude6)";

                        if(forSize == 6) //If Hexagon, no NULL values
                        {
                            command.Parameters.AddWithValue("@latitude6", coords[10]);
                            command.Parameters.AddWithValue("@longitude6", coords[11]);
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@latitude6", null);
                            command.Parameters.AddWithValue("@longitude6", null);
                        }
                        
                        command.Parameters.AddWithValue("@centerLatitude", center.Latitude.RadiansToDegrees()); //RadiansToDegrees() not on when script first ran.
                        command.Parameters.AddWithValue("@centerLongitude", center.Longitude.RadiansToDegrees()); //RadiansToDegrees() not on when script first ran.
                        command.Parameters.AddWithValue("@latitude1", coords[0]);
                        command.Parameters.AddWithValue("@longitude1", coords[1]);
                        command.Parameters.AddWithValue("@latitude2", coords[2]);
                        command.Parameters.AddWithValue("@longitude2", coords[3]);
                        command.Parameters.AddWithValue("@latitude3", coords[4]);
                        command.Parameters.AddWithValue("@longitude3", coords[5]);
                        command.Parameters.AddWithValue("@latitude4", coords[6]);
                        command.Parameters.AddWithValue("@longitude4", coords[7]);
                        command.Parameters.AddWithValue("@latitude5", coords[8]);
                        command.Parameters.AddWithValue("@longitude5", coords[9]);

                        command.ExecuteNonQuery();

                        command.Connection.Close();
                    }

                    //Clear list
                    coords.Clear();
                    geoVerts.Clear();
                }
                else
                {
                    //Commit war crimes (error checking. Possibly explosions.)
                    Console.WriteLine("An error has occurred. H3 isn't valid.");
                }
            }
        }

        public List<string> getAllH3(string state)
        {
            string h3Table = "h3_" + state + "_data";
            List<string> h3_oregon_data = new List<string>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;

                command.CommandText = @"SELECT h3_res9_id FROM " + h3Table + ";"; //LIMIT 15000000 OFFSET <get from database>

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        String cellular = reader.GetString(0);
                        h3_oregon_data.Add(cellular);
                    }
                }

                command.Connection.Close();
            }

            return h3_oregon_data;
        }

        public List<float> getAllCoordsThreaded(int max_pass, float latMin, float lngMin, float latMax, float lngMax)
        {
            List<float> coords = new List<float>();
            List<Thread> threads = new List<Thread>();
            
            for(int i = 0; i < max_pass; i++)
            {
                Thread thread = new Thread(new ThreadStart(() => coords.AddRange(getAllCoordsSingle(max_pass, i, latMin, lngMin, latMax, lngMax))));
                thread.Start();
                threads.Add(thread);
            }

            foreach(Thread thread in threads)
            {
                thread.Join();
            }

            return coords;
        }

        public List<float> getAllCoordsSingle(int max_pass, int pass, float latMin, float lngMin, float latMax, float lngMax)
        {
            List<float> latLng_coord_data = new List<float>();

            lngMin = lngMin * ((float)Math.PI / 180);
            lngMax = lngMax * ((float)Math.PI / 180);
            latMin = latMin * ((float)Math.PI / 180);
            latMax = latMax * ((float)Math.PI / 180);

            int offset = 0, lim = 0;

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT COUNT(id) FROM " + COORDTABLE + ";";
                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lim = reader.GetInt32(0) / max_pass;
                        offset = lim * pass;
                    }
                }
                command.CommandText = @"SELECT centerLongitude, centerLatitude, latitude1, longitude1, latitude2, longitude2,"
                    + " latitude3, longitude3, latitude4, longitude4, latitude5, longitude5, latitude6, longitude6 FROM " + COORDTABLE
                    + " WHERE centerLongitude BETWEEN @lngMax and @lngMin and centerLatitude BETWEEN @latMax and @latMin LIMIT @lim OFFSET @offset;";
                command.Parameters.AddWithValue("lngMin", lngMin);
                command.Parameters.AddWithValue("lngMax", lngMax);
                command.Parameters.AddWithValue("latMin", latMin);
                command.Parameters.AddWithValue("latMax", latMax);
                command.Parameters.AddWithValue("offset", offset);
                command.Parameters.AddWithValue("lim", lim);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        //Compare centers (beginning) before (start at 2)
                        //Then go to 13 (<14) for all data received from sql statement
                        for (int i = 2; i < 14; i++)
                        {
                            float coord = reader.GetFloat(i);
                            latLng_coord_data.Add(coord);
                        }
                    }
                }
            }

            return latLng_coord_data;
        }

    }
}