using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web
{
    public class SecurityFilter : FilterAttribute,IAuthorizationFilter
    {


        private string _module { get; set; }
        private string _rightCode { get; set; }
        
        public SecurityFilter(string module,string rightCode)
        {
            this._module = module;
            this._rightCode = rightCode;
        }
      
  


        
          


     
        public void OnAuthorization(AuthorizationContext filterContext)
        {
            if(System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
              {
                  string userName = System.Web.HttpContext.Current.User.Identity.Name;
                  if(userName!="Admin")
                  {
                        var view = new ViewResult();
                        view.ViewName = "~/Views/Common/Error.cshtml";
                        view.ViewBag.errorCode = "401";
                        view.ViewBag.errorMsg = "您没有权限访问该模块";
                        filterContext.Result = view;
                  }  
              }

                    
        }
    }
}
