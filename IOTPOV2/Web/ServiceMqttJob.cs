using Quartz;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;
using Common.Entity;

namespace Web
{
    public class ServiceMqttJob : IJob
    {
        private static string address = ConfigurationManager.AppSettings["iothub"];
        private static MqttClient client = new MqttClient(address);
        private static List<PovDevice> povDevices = new List<PovDevice>();

        public ServiceMqttJob()
        {
            povDevices = PovDevice.GetListByProperty(a => a.State, "1");
            client.MqttMsgPublished += client_MqttMsgPublished;
        }
        static void writeReport(string msg)
        {
            var reportDirectory = string.Format("~/reports/{0}/", DateTime.Now.ToString("yyyy-MM"));
            reportDirectory = System.Web.Hosting.HostingEnvironment.MapPath(reportDirectory);
            if (!Directory.Exists(reportDirectory))
            {
                Directory.CreateDirectory(reportDirectory);
            }
            var dailyReportFullPath = string.Format("{0}report_{1}.log", reportDirectory, DateTime.Now.Day);
            var logContent = string.Format("{0}==>>{1}{2}", DateTime.Now, msg, Environment.NewLine);
            File.AppendAllText(dailyReportFullPath, logContent);

        }

        static void  client_MqttMsgPublished(object sender, MqttMsgPublishedEventArgs e)
        {
            
        }
        public void Execute(IJobExecutionContext context)
        {
            try
            {
                string clientId = Guid.NewGuid().ToString();
                foreach(var device in povDevices){
                    var sendDevice  = Client.GetListByProperty(a => a.TargetPovID, device.Id).FindAll(b =>b.IsPay==true).FindAll(c => c.IsPlay == false).FirstOrDefault();
                    client.Connect(clientId );
                    ushort i = client.Publish("Device001_Content", Encoding.UTF8.GetBytes("device01" + DateTime.Now.ToString()), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
                }
                
                
                
                
            }
            catch(Exception e)
            {
                writeReport(e.Message);
            }
        }

    }
}