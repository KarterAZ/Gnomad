using Microsoft.Extensions.Configuration;

namespace GnomadAPI.Data
{
    public class TestingDatabase : Connection
    {
        TestingDatabase(IConfiguration config)
        {
            ConnectionString = config.GetConnectionString("TestingDatabase");
        }
    }
}
