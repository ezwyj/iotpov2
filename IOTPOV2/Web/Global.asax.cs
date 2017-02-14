using Common.Model;
using Senparc.Weixin.MP.Containers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Web
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        private string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private string appSecret = ConfigurationManager.AppSettings["WeixinAppSecret"];

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);


            if (!AccessTokenContainer.CheckRegistered(appId))//检查是否已经注册
            {

                AccessTokenContainer.Register(appId, appSecret);//如果没有注册则进行注册

            }

            var result = AccessTokenContainer.GetAccessTokenResult(appId); 
        }
        void Session_End(object sender, EventArgs e)
        {
           
        }

    }
}