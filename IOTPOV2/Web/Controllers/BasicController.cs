using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class BasicController : Controller
    {
        //
        // GET: /GameOne/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult test()
        {
            return View();
        }

    }
}
