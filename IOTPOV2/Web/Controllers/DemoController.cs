using Senparc.Weixin;
using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.AdvancedAPIs.OAuth;
using Senparc.Weixin.MP.AdvancedAPIs.QrCode;
using Senparc.Weixin.MP.CommonAPIs;
using Senparc.Weixin.MP.Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class DemoController : Controller
    {
        private string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private string secret = ConfigurationManager.AppSettings["WeixinAppSecret"];

        private OAuthAccessTokenResult GetOAuthAccessTokenResult(string code, string state, out string msg)
        {
            if (string.IsNullOrEmpty(code))
            {
                msg = "no Code";
                return null;
            }

            if (state != "JeffreySu")
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

        public ActionResult Index()
        {
            return View();
        }

       

        public ActionResult Create(string deviceName,string code,string state)
        {
            string msg = string.Empty;
            OAuthAccessTokenResult result = GetOAuthAccessTokenResult(code, state, out msg);
            OAuthUserInfo userInfo = OAuthApi.GetUserInfo(result.access_token, result.openid);
            .JsSdkPackage = JSSDKHelper.GetJsSdkUiPackage(appId, secret, Request.Url.AbsoluteUri);
            return View();
        }

        //
        // 提交图片

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        
    }
}
