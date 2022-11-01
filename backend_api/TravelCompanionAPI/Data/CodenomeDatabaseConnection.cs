//#############################################################
//
// Author: Bryce Schultz
// Date: 11/1/2022
// 
// Purpose: A class for connecting to the main database
//
//#############################################################

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelCompanionAPI.Data
{
    public class CodenomeDatabaseConnection : DatabaseConnection
    {
        private CodenomeDatabaseConnection()
        {
            _server = "travel.bryceschultz.com";
            _database = "codenome_db";
            _username = "codenome";
            _password = "Codenome!1";
        }

        private static CodenomeDatabaseConnection _instance;

        public static CodenomeDatabaseConnection getInstance()
        {
            if (_instance == null)
                _instance = new CodenomeDatabaseConnection();
            return _instance;
        }
    }
}
