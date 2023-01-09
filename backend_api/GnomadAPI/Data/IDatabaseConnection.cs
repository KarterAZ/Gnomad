using System.Collections.Generic;

namespace TravelCompanionAPI.Data
{   
    public interface IDatabaseConnection<T> where T : DataConnection
    {
         public MySqlConnection getConnection();
    }
}
