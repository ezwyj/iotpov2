using Common.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace MessageServerService
{
    class Program
    {

        static void Main(string[] args)
        {
            //取初始数据
            string address = "chengdu_pov.mqtt.iot.gz.baidubce.com";  //阿里：112.74.87.217

            MqttClient client = new MqttClient(address);
            List<PovDevice> povDevices = PovDevice.GetListByProperty(a => a.State, "1");

            //while(1==1)
            //{
            //    try
            //    {

            //        var needTranMessage = Client.GetListByProperty(a=>a.IsPlay,false).FindAll(b=>b.IsPay==false);
            //        foreach(var itemMessage in needTranMessage){
            //            Console.WriteLine("Device:"+needTranMessage);
            //            if (!client.IsConnected)
            //            {
            //                string clientId = Guid.NewGuid().ToString();
            //                client.Connect(clientId, itemMessage.Device.BaiDuYunName, itemMessage.Device.BaiDuYunPwd);
            //            }
            //            ushort i = client.Publish(itemMessage.Device.DeviceName.Trim() + "_Content", Encoding.UTF8.GetBytes(itemMessage.Device.DeviceName.Trim() + "_" + DateTime.Now.ToString()), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
            //            itemMessage.IsPlay = true;
            //        }
                    

                    

            //    }
                
            //    catch{

            //    }
            //    finally
            //    {
            //        System.Threading.Thread.Sleep(100);
            //    }
            //}

        }
    }
}
