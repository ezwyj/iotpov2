using Common.Model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PetaPoco;

namespace Common.Service
{
    public class ClientService
    {
        public int AddClient(Client client, out string msg)
        {
            int rt = 0;
            try
            {
                using (var conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["POVDB"].ConnectionString))
                {
                    var cmd = new SqlCommand();
                    cmd.Connection = conn;
                    cmd.CommandText = "insert DeviceClient (WeixinImage,weixinOpenId) values ('" + client.WeixinImage+"','"+client.WeixinOpenId+"');select @@identity";
                    conn.Open();
                    var reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        rt = int.Parse(reader.GetValue(0).ToString());
                    }
                    reader.Close();
                    conn.Close();
                    msg = "";
                }
            }
            catch (Exception e)
            {
                msg = e.Message;
            }
            return rt;
        }

        public bool UpdateClient(Client client,out string msg)
        {
            bool state = false;
            try
            {
                Database db = new Database("POVDB");
                db.Execute("update DeviceClient set isPlay=1 where id=@0", client.Id);
                state = true;
                msg = "";
            }
            catch(Exception e)
            {
                msg = e.Message;
            }
            return state;
        }
    }
}
