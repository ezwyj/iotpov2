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
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace Web.Controllers
{
    public class DemoController : Controller
    {
        private static string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private static string secret = ConfigurationManager.AppSettings["WeixinAppSecret"];
        private static string MQTT_BROKER_ADDRESS = "chengdu_pov.mqtt.iot.gz.baidubce.com";
        private static Dictionary<string, PovDevice> povDevices = new Dictionary<string, PovDevice>();

        public DemoController()
        {
            var device = PovDevice.GetList();
            foreach (var deviceItem in device)
            {
                if (!povDevices.ContainsKey(deviceItem.DeviceName))
                {
                    povDevices.Add(deviceItem.DeviceName, deviceItem);
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
        /// <summary>
        /// 介绍使用流程页面
        /// </summary>
        /// <returns></returns>
        public ActionResult Index(string deviceName)
        {
            ViewData["UrlBase"] = OAuthApi.GetAuthorizeUrl(appId, "http://demo1.deviceiot.top/iot/Demo/Create", deviceName, OAuthScope.snsapi_base);
            return View();
        }

       

        public ActionResult Create(string code,string state)
        {
            string msg = string.Empty;
            if (string.IsNullOrEmpty(code))
            {
                return Content("您拒绝了授权！");
            }

            if (state != "Device001")
            {
                //这里的state其实是会暴露给客户端的，验证能力很弱，这里只是演示一下
                //实际上可以存任何想传递的数据，比如用户ID，并且需要结合例如下面的Session["OAuthAccessToken"]进行验证
                return Content("验证失败！请从正规途径进入！");
            }

            //通过，用code换取access_token
            var result = OAuthApi.GetAccessToken(appId, secret, code);
            if (result.errcode != ReturnCode.请求成功)
            {
                return Content("错误：" + result.errmsg);
            }

            //下面2个数据也可以自己封装成一个类，储存在数据库中（建议结合缓存）
            //如果可以确保安全，可以将access_token存入用户的cookie中，每一个人的access_token是不一样的
            Session["OAuthAccessTokenStartTime"] = DateTime.Now;
            Session["OAuthAccessToken"] = result;

            //因为这里还不确定用户是否关注本微信，所以只能试探性地获取一下
            OAuthUserInfo userInfo = null;
            try
            {
                //已关注，可以得到详细信息
                userInfo = OAuthApi.GetUserInfo(result.access_token, result.openid);
 
                return View("UserInfoCallback", userInfo);
            }
            catch (ErrorJsonResultException ex)
            {
                //未关注，只能授权，无法得到详细信息
                //这里的 ex.JsonResult 可能为："{\"errcode\":40003,\"errmsg\":\"invalid openid\"}"
                return Content("用户已授权，授权Token：" + result);
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

        [HttpPost]
        public ActionResult Create(string dataJson)
        {
            string msg=string.Empty;
            try
            {
                var client = Serializer.ToObject<Client>(dataJson);



                    client.BaiDuYunName = povDevices[client.DeviceName].BaiDuYunName;
                    client.BaiDuYunPwd = povDevices[client.DeviceName].BaiDuYunPwd;
                    
                    MqttClient mqttClient = new MqttClient(MQTT_BROKER_ADDRESS);
                    try
                    {


                        string clientId = Guid.NewGuid().ToString();
                        mqttClient.Connect(clientId, client.BaiDuYunName, client.BaiDuYunPwd);

                        foreach (var imgString in client.ImageLines)
                        {
                            mqttClient.Publish(client.DeviceName + "_Content", Encoding.UTF8.GetBytes(imgString), MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE, false);
                        }
                        client.PlayStartTime = DateTime.Now;
                        
                    }
                    catch (Exception e)
                    {

                    }
                    finally
                    {
                        if (mqttClient.IsConnected)
                        {
                            mqttClient.Disconnect();
                        }
                    }
               

                return RedirectToAction("Show");
            }
            catch(Exception e)
            {
                ViewBag.errMsg = e.Message;
                return View("");
            }
        }

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
