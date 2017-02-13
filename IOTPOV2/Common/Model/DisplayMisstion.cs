using Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace Common.Model
{
    public class DisplayMisstion
    {
        static string MQTT_BROKER_ADDRESS = "chengdu_pov.mqtt.iot.gz.baidubce.com";

        private Client _entity;

        public DisplayMisstion(Client client)
        {
            _entity = client;
        }

        public bool SendImage()
        {
            bool result = false;
            string msg = string.Empty;


            _entity.DisplayEnd += entity_DisplayEnd;

            MqttClient client = new MqttClient(IPAddress.Parse(MQTT_BROKER_ADDRESS));
            try
            {
                

                string clientId = Guid.NewGuid().ToString();
                client.Connect(clientId, _entity.BaiDuYunName, _entity.BaiDuYunPwd);

                foreach (var imgString in _entity.ImageLines)
                {
                    client.Publish(_entity.DeviceName + "_Content", Encoding.UTF8.GetBytes(imgString), MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE, false);
                }
                _entity.PlayStartTime = DateTime.Now;
                result = true;
            }
            catch (Exception e)
            {

            }
            finally
            {
                if(client.IsConnected){
                    client.Disconnect();
                }
            }
            return result;
        }

        void entity_DisplayEnd()
        {
            PetaPoco.Database db = new PetaPoco.Database("POVDB");
            _entity.PlayEndTime = DateTime.Now;
            db.Update(_entity);
        }


        
    }
}
