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
using System.Linq;
using System.Threading.Tasks;
using TravelCompanionAPI.Models;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.Common;
using System.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using H3Lib;
using H3Lib.Extensions;
using System.Diagnostics;

namespace TravelCompanionAPI.Data
{
    //******************************************************************************
    //This class updates the h3_oregon_data table, inheriting from IDataRepository.
    //No new methods added.
    //Implements getByH3Id, getAll
    //******************************************************************************
    public class CellularTableModifier : ICellDataRepository<Cellular>
    {
        const string TABLE = "h3_oregon_data";

        public CellularTableModifier(IConfiguration config)
        {

        }

        public Cellular getByH3Id(string id)
        {
            Cellular cellular = null;

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                command.CommandText = "SELECT * FROM " + TABLE + " WHERE h3_res9_id = @Id";
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
                command.CommandText = @"SELECT * FROM " + TABLE + " Limit 25 ;";

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

        public List<string> getAllH3()
        {
            List<string> h3_oregon_data = new List<string>();

            using (MySqlCommand command = new MySqlCommand())
            {
                command.Connection = DatabaseConnection.getInstance().getConnection();
                command.CommandType = CommandType.Text;
                command.CommandText = @"SELECT * FROM " + TABLE + " Limit 25 ;";

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        String cellular = reader.GetString(4);
                        h3_oregon_data.Add(cellular);
                    }
                }
            }

            return h3_oregon_data;
        }

        public List<Tuple<decimal, decimal>> getCoords() //List<GeoCoord> getCoords()
        {
            List<string> h3ids = getAllH3();
            List<Tuple<decimal, decimal>> coords = new List<Tuple<decimal, decimal>>();
            Tuple<decimal, decimal> tup;
            H3Index h3;
            GeoCoord geo = new GeoCoord();
            //List<GeoCoord> geolist = new List<GeoCoord>();

            foreach(string id in h3ids)
            {
                h3 = id.ToH3Index();
                //Debug.WriteLine(h3.ToString());
                geo = h3.ToGeoCoord();
                //geolist.Add(geo);
                tup = new Tuple<decimal, decimal>(geo.Latitude, geo.Longitude);
                coords.Add(tup);
            }

            return coords;
            //return geolist;
        }

        public decimal[] getCoordsLat()
        {
            List<string> h3ids = getAllH3();

            decimal[] coords = new decimal[h3ids.Count];

            H3Index h3;
            GeoCoord geo = new GeoCoord();

            for (int i = 0; i < h3ids.Count(); i++)
            {
                h3 = h3ids[i].ToH3Index();
                geo = h3.ToGeoCoord();
                coords[i] = geo.Latitude;
            }

            return coords;
        }

        public decimal[] getCoordsLng()
        {
            List<string> h3ids = getAllH3();

            decimal[] coords = new decimal[h3ids.Count];

            H3Index h3;
            GeoCoord geo = new GeoCoord();

            for (int i = 0; i < h3ids.Count(); i++)
            {
                h3 = h3ids[i].ToH3Index();
                geo = h3.ToGeoCoord();
                coords[i] = geo.Longitude;
            }

            return coords;
        }
    }
}