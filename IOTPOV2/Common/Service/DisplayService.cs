using Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace Common.Service
{
    public class DisplayService
    {
        static string MQTT_BROKER_ADDRESS = "chengdu_pov.mqtt.iot.gz.baidubce.com";
        
        public bool PostImage( Mission entity)
        {
            bool result = false;
            string msg = string.Empty;
            //demo版，直接传消息到BAIDU
            MqttClient client = new MqttClient(IPAddress.Parse(MQTT_BROKER_ADDRESS));
            try
            {
                

                string clientId = Guid.NewGuid().ToString();
                client.Connect(clientId, entity.BaiDuYunName, entity.BaiDuYunPwd);

                foreach (var imgString in entity.ImageLines)
                {
                    client.Publish(entity.DeviceName + "_Content", Encoding.UTF8.GetBytes(imgString), MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE, false);
                }
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

        public bool Pay(int clientId, out string msg)
        {
            throw new NotImplementedException();
        }
    }
}
