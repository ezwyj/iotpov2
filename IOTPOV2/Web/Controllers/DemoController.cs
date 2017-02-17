using Common.Entity;
using Common.Model;
using Common.Util;
using Senparc.Weixin;
using Senparc.Weixin.Exceptions;
using Senparc.Weixin.MP;
using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.AdvancedAPIs.OAuth;
using Senparc.Weixin.MP.AdvancedAPIs.QrCode;
using Senparc.Weixin.MP.CommonAPIs;
using Senparc.Weixin.MP.Containers;
using Senparc.Weixin.MP.Helpers;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;


namespace Web.Controllers
{
    public class DemoController : Controller
    {
        private static string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private static string secret = ConfigurationManager.AppSettings["WeixinAppSecret"];
        private static string MQTT_BROKER_ADDRESS = "chengdu_pov.mqtt.iot.gz.baidubce.com";
        private static Dictionary<string, PovDevice> povDevices = new Dictionary<string, PovDevice>();
        private static StackExchange.Redis.ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379");
        public DemoController()
        {
            var device = PovDevice.GetList();
            foreach (var deviceItem in device)
            {
                if (!povDevices.ContainsKey(deviceItem.DeviceName.Trim()))
                {
                    povDevices.Add(deviceItem.DeviceName.Trim(), deviceItem);
                }
            }
        }
        private OAuthAccessTokenResult GetOAuthAccessTokenResult(string code, string state, out string msg)
        {
            //if (string.IsNullOrEmpty(code))
            //{
            //    msg = "no Code";
            //    return null;
            //}

            if (state != "Device001")
            {
                //这里的state其实是会暴露给客户端的，验证能力很弱，这里只是演示一下
                //实际上可以存任何想传递的数据，比如用户ID，并且需要结合例如下面的Session["OAuthAccessToken"]进行验证
                msg = "no state";
                return null;
            }

            OAuthAccessTokenResult result = null;

            //通过，用code换取access_token
            try
            {
                result = OAuthApi.GetAccessToken(appId, secret, code);
            }
            catch (Exception ex)
            {
                msg = ex.Message;

            }
            if (result.errcode != ReturnCode.请求成功)
            {
                msg = "错误：" + result.errmsg;

            }
            //下面2个数据也可以自己封装成一个类，储存在数据库中（建议结合缓存）
            //如果可以确保安全，可以将access_token存入用户的cookie中，每一个人的access_token是不一样的
            Session["OAuthAccessTokenStartTime"] = DateTime.Now;
            Session["OAuthAccessToken"] = result;
            msg = "OK";
            return result;
        }
      
        [HttpGet]
        public ActionResult First(string deviceName)
        {
            var jsSdkPackage =  JSSDKHelper.GetJsSdkUiPackage(appId, secret, Request.Url.AbsoluteUri);
            ViewBag.JsSdkPackageAppId= jsSdkPackage.AppId;
            ViewBag.JsSdkPackageTimestamp=jsSdkPackage.Timestamp;
            ViewBag.JsSdkPackageNonceStr=jsSdkPackage.NonceStr;
            ViewBag.JsSdkPackageSignature=jsSdkPackage.Signature;

            Client entity = new Client();
            entity.DeviceName = deviceName;

            return View(entity);
        }
        [HttpPost]
        public JsonResult FirstPost(string dataJson)
        {
            string msg = string.Empty;
            bool state = true;
            try
            {
                var client = Serializer.ToObject<Client>(dataJson);
                client.BaiDuYunName = povDevices[client.DeviceName].BaiDuYunName;
                client.BaiDuYunPwd = povDevices[client.DeviceName].BaiDuYunPwd;
                ISubscriber redisPublic = redis.GetSubscriber();
                if (redis.IsConnected)
                {
                    using (var memoryStream = new MemoryStream()){
                        ProtoBuf.Serializer.Serialize<Client>(memoryStream,client);
                        redisPublic.Publish(client.DeviceName.Trim(), memoryStream.ToArray());
                    }
                    
                }




                return new JsonResult { Data = new { state = state, msg = msg } };
            }
            catch (Exception e)
            {

                return new JsonResult { Data = new { state = state, msg = e.Message } };
            }
        }
        public ActionResult Pay()
        {

            return View();
        }

        [HttpPost]
        public ActionResult Pay(FormCollection collection)
        {
            return View();
        }

        public ActionResult Show()
        {
            return View();
        }
        //
        // 编辑完成，确认发布

      

        private bool SavePicture(string name, out string msg)
        {
            try
            {
                MemoryStream img = new MemoryStream();
                Senparc.Weixin.MP.AdvancedAPIs.MediaApi.Get(AccessTokenContainer.TryGetAccessToken(appId, secret), name, img);


                var accessToken = AccessTokenContainer.TryGetAccessToken(appId, secret);
                string fileName = name + ".jpg";
                string savePath = Server.MapPath("~/Upload/") + DateTime.Now.ToString("yyyyMMdd") ;
                if (System.IO.Directory.Exists(Server.MapPath(savePath)) == false)//如果不存在就创建file文件夹
                {

                    System.IO.Directory.CreateDirectory(Server.MapPath(savePath));

                }
               
                FileStream writer = new FileStream(savePath+"/"+fileName, FileMode.OpenOrCreate, FileAccess.Write);
                img.WriteTo(writer);
                writer.Close();
                writer.Dispose();
                msg = string.Empty;
                return true;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return false;
            }
        }
    }
}
