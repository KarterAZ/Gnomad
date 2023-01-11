using Microsoft.Extensions.Configuration;

namespace GnomadAPI.Data
{
    public abstract class Connection
    {
        public string ConnectionString { get; set; }
    }
}
