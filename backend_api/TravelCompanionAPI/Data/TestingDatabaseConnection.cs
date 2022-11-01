using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelCompanionAPI.Data
{
    public class TestingDatabaseConnection : DatabaseConnection
    {
        private TestingDatabaseConnection()
        {
            _server = "travel.bryceschultz.com";
            _database = "codenome_testing";
            _username = "codenome";
            _password = "Codenome!1";
        }

        private static TestingDatabaseConnection _instance;

        public static TestingDatabaseConnection getInstance()
        {
            if (_instance == null)
                _instance = new TestingDatabaseConnection();
            return _instance;
        }
    }
}
