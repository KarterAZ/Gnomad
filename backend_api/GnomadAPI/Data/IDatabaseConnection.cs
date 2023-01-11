using GnomadAPI.Data;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace TravelCompanionAPI.Data
{   
    public interface IDatabaseConnection<T> where T : Connection
    {
        public MySqlConnection getConnection();
    }
}
