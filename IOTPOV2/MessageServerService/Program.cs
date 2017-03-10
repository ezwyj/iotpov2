using Common.Entity;
using Common.Service;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace MessageServerService
{
    class Program
    {
        static string mqttServerAddress = "message.deviceiot.top";

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
                        lock (GlobalVariable.PovDevices[client.DeviceName.Trim()])
                        {
                            GlobalVariable.PovDevices[client.DeviceName].ClientMisstion.Enqueue(client);
                            Console.WriteLine("Device {0} ,enqueue ,at {1}",client.DeviceName,DateTime.Now.ToLongTimeString());
                        }
                        

                    }
                    //Console.WriteLine((string)bytes);
                });
            }

        }

        static void DeviceListenFromClientDevice(object param)
        {

            string deviceName = param.ToString();
            MqttClient mqttClient = new MqttClient(mqttServerAddress);
            mqttClient.MqttMsgPublishReceived += client_MqttMsgPublishReceived;
            try
            {
              

                string clientId = "Server_"+Guid.NewGuid().ToString();
                mqttClient.Connect(clientId);//, client.BaiDuYunName, client.BaiDuYunPwd
                mqttClient.Subscribe(new string[] { deviceName + "_WorkState" }, new byte[] { MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE });




            }
            catch (Exception ee)
            {
                Action<string> log = new Action<string>(WriteErrLog);
                log(ee.Message + ee.StackTrace);
                Console.WriteLine("mqtt error:" + ee.Message);
            }
            

        }

        private static void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            string msg = string.Empty;
            string deviceName = e.Topic.Replace("_WorkState", "");
            var povDevice = GlobalVariable.PovDevices[deviceName];
            msg = System.Text.Encoding.Default.GetString(e.Message);
            switch (msg)
            {
                case "next":
                    #region 开放一个新的播放
                    
                    if (povDevice.ClientMisstion.Count > 0)
                    {
                        var client = povDevice.ClientMisstion.Dequeue();
                        ClientService dbService = new ClientService();

                        bool ret = dbService.UpdateClient(client, out msg);
                        if (!ret)
                        {
                            Console.WriteLine(msg);
                        }
                        else
                        {

                        }
                        Device_Send(client);
                    }
                    else
                    {
                        //播放广告
                    }
                    #endregion
                    break;
                case "online":
                    povDevice.Connected = true;
                    break;
                default:
                    povDevice.Connected = false;
                    break;
            }
            
            
        }

        static void Main(string[] args)
        {
            //取初始数据
            GlobalVariable.PovDevices = new Dictionary<string, PovDevice>();

            
            var devices = PovDevice.GetList();
            foreach(var device in devices)
            {
                string deviceName = device.DeviceName.Trim();
                GlobalVariable.PovDevices.Add(deviceName, device);
                var task = new Task(DeviceListen,deviceName);
                task.Start();
                var taskDeviceListen = new Task(DeviceListenFromClientDevice, deviceName);
                taskDeviceListen.Start();
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

        private static void Device_Send(Common.Model.Client client)
        {
            string msg = "";
            MqttClient mqttClient = new MqttClient(mqttServerAddress);
            mqttClient.MqttMsgPublished += MqttClient_MqttMsgPublished;
            try
            {
                

                string clientId = Guid.NewGuid().ToString();
                mqttClient.Connect(clientId);//, client.BaiDuYunName, client.BaiDuYunPwd
                int x = 0;
                foreach (var imgString in client.ImageLines)
                {
                    //mqttClient.Publish(client.DeviceName.Trim() + "_Content", Encoding.UTF8.GetBytes(imgString), MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE, false);

                    string line = imgString.Substring(0, 3);
                    string topic = client.DeviceName.Trim() + "_Content" ;
                    string content = imgString.Substring(3);
                    //Console.WriteLine("Topic:{0},Content:{1}", topic, imgString);
                    for(int y=0;y<content.Length/6;y++)
                    {
                        string one = content.Substring(y * 6, 6);
                        var i = mqttClient.Publish(topic, Encoding.UTF8.GetBytes(one), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
                        Console.WriteLine("send: x:{0},y:{1},value:{2},msg {3}",x.ToString(),y.ToString(), one,i.ToString());

                    }
                    x++;
                }

                
                


            }
            catch (Exception ee)
            {

                Console.WriteLine("mqtt error:" + ee.Message);
                Action<string> log = new Action<string>(WriteErrLog);
                log(ee.Message+ee.StackTrace);
            }
            //finally
            //{
            //    if (mqttClient.IsConnected)
            //    {
            //        mqttClient.Disconnect();
            //    }
            //}
        }

        private static void MqttClient_MqttMsgPublished(object sender, MqttMsgPublishedEventArgs e)
        {
            Console.WriteLine("MessageId = " + e.MessageId + " Published = " + e.IsPublished);
        }

        private static void WriteErrLog(string t)
        {
            FileLog errlog = new FileLog(AppDomain.CurrentDomain.BaseDirectory + @"/log/errLog.txt");
            errlog.log(t);
        }
        public static void WriteRunLog(string t)
        {
            FileLog runlog = new FileLog(AppDomain.CurrentDomain.BaseDirectory + @"/log/runLog.txt");
            runlog.log(t);

        }
    }
}
