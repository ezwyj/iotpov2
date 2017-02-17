using Common.Entity;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace MessageServerService
{
    class Program
    {
        static void DeviceListen(object param)
        {

            string deviceName = param.ToString();
            StackExchange.Redis.ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379");
            ISubscriber sub = redis.GetSubscriber();
            if (redis.IsConnected)
            {
                Console.WriteLine("Subscribe " + deviceName.Trim());
                sub.Subscribe(deviceName.Trim(), (channel, bytes) =>
                {
                    using (var memoryStream = new MemoryStream(bytes))
                    {
                        var client = ProtoBuf.Serializer.Deserialize<Common.Model.Client>(memoryStream);
                        Console.WriteLine(client.DeviceName);
                        //chengdu_pov.mqtt.iot.gz.baidubce.com
                        MqttClient mqttClient = new MqttClient("120.25.214.231");
                        try
                        {


                            string clientId = Guid.NewGuid().ToString();
                            mqttClient.Connect(clientId);//, client.BaiDuYunName, client.BaiDuYunPwd
                            
                                foreach (var imgString in client.ImageLines)
                                {
                                    //mqttClient.Publish(client.DeviceName.Trim() + "_Content", Encoding.UTF8.GetBytes(imgString), MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE, false);
                                    
                                    string line = imgString.Substring(0, 3);
                                    string topic = client.DeviceName.Trim() + "_Content"+line;
                                    string content = imgString.Substring(4);
                                    Console.WriteLine("Topic:{0},Content:{1}", topic, content);
                                    mqttClient.Publish(topic, Encoding.UTF8.GetBytes(content), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
                                }
                            
                                
                            

                        }
                        catch (Exception e)
                        {
                           
                            Console.WriteLine( "mqtt error:" + e.Message);
                        }
                        finally
                        {
                            if (mqttClient.IsConnected)
                            {
                                mqttClient.Disconnect();
                            }
                        }

                    }
                    //Console.WriteLine((string)bytes);
                });
            }

        }

        static void Main(string[] args)
        {
            //取初始数据
            

            
            List<PovDevice> povDevices = PovDevice.GetList();
            for (int i = 0; i < povDevices.Count; i++)
            {
                string deviceName = povDevices[i].DeviceName;
                var task = new Task(DeviceListen,deviceName);
                task.Start();
            }
            Console.ReadLine();
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
