using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            string badge = HttpContext.User.Identity.Name;

            if (!Service.RightService.IsHaveRight(badge, "首页查看"))
            {
                Response.Redirect("~/NPI/Index", true);
                return null;
            }

            return View();
        }

    }
}
