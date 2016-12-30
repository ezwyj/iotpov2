using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Common.Entity;
using Common.Util;
using Common.Service;

namespace Web.Controllers
{
    public class CoreController : Controller
    {
        //
        // GET: /Core/

        public JsonResult AddImage(string povDeviceId,string dataJson)
        {
            bool state = false;
            string msg = string.Empty;

            try
            {
                Client entity = Serializer.ToObject<Client>(dataJson);
                Common.Service.CommonService service = new CommonService();
                state = service.AddBasicImage(povDeviceId,entity);
                msg = entity.Id.ToString();
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { state = state, msg = msg } };
        }

        public JsonResult Pay(int clientId)
        {
            bool state = false;
            string msg = string.Empty;

            try
            {
                
                Common.Service.CommonService service = new CommonService();
                state = service.Pay(clientId,out msg);
                
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { state = state, msg = msg } };
        }
    }
}
