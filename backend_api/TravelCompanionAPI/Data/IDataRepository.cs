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

namespace TravelCompanionAPI.Data
{
    public interface IDataRepository<T> where T : IDataEntity
    {
        //Singleton stuff:
        //private static IDataRepository<User> _instance;
        //public static IDataRepository<User> getInstance(IDataRepository<User> instance)
        //{
        //    if (_instance == null)
        //        _instance = instance;
        //    return _instance;
        //}

        public T getById(int id);

        public List<T> getAll();

        public int add(T data);
    }
}
