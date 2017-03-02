using DocumentFormat.OpenXml.Spreadsheet;
using DogNet.Common.ExcelOperation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class SystemController : Controller
    {
        public ActionResult Setting()
        {
            string badge = HttpContext.User.Identity.Name;
            Right.Entity.RightEntity right = Right.Entity.RightEntity.GetListByProperty(a => a.RightUser, badge).FirstOrDefault();

            if (right == null || !(right.RightName.Contains("权限设置") || right.RightName.Contains("值集维护")))
            {
                ViewBag.errorMessage = "对不起，您没有该模块的权限~";
                return View("~/Views/Shared/_Error.cshtml");
            }

            ViewBag.setList = ValueSet.Service.ValueSetService.GetSetList();
            ViewBag.rightName = right.RightName;

            return View();
        }
        public ActionResult Logs()
        {
            string badge = HttpContext.User.Identity.Name;

            if (!Service.RightService.IsHaveRight(badge, "日志查询"))
            {
                ViewBag.errorMessage = "对不起，您没有该模块的权限~";
                return View("~/Views/Shared/_Error.cshtml");
            }

            return View();
        }
        // POST: 保存集
        [HttpPost]
        public JsonResult SaveValueSet(string valueSetJson)
        {
            bool state = true;
            string msg = string.Empty;

            ValueSet.Entity.ValueSetEntity entity = ValueSet.Service.ValueSetService.SaveValueSet(valueSetJson, out state, out msg);
            if (string.IsNullOrEmpty(msg)) msg = "增加成功";
            return new JsonResult { Data = new { state = state, msg = msg, data = entity } };
        }

        // GET: 获取值列表
        public JsonResult GetValueList(int id)
        {
            bool state = true;
            string msg = string.Empty;
            List<ValueSet.Entity.ValueSetEntity> valueList = null;

            try
            {
                valueList = ValueSet.Service.ValueSetService.GetValueList(id);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = valueList }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Get: 根据id获取值集
        public JsonResult GetValueSetById(string id)
        {
            bool state = true;
            string msg = string.Empty;
            ValueSet.Entity.ValueSetEntity entity = null;

            try
            {
                entity = ValueSet.Entity.ValueSetEntity.GetSingle(id);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = entity }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // GET: 删除集
        public JsonResult DeleteValueSet(string id)
        {
            bool state = true;
            string msg = string.Empty;

            state = ValueSet.Service.ValueSetService.Delete(id, out msg);

            return new JsonResult { Data = new { state = state, msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // 获取日志
        public JsonResult GetLogList(int pageIndex, int pageSize, int? type, string logOperator, string startTime, string endTime)
        {
            bool state = true;
            string msg = string.Empty;
            long total = 0;
            List<Log.Entity.LogEntity> logList = null;

            try
            {
                logList = Log.Service.LogService.SearchList(pageIndex, pageSize, type, logOperator, startTime, endTime, out total);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = logList, total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // 导出日志
        public void ExportLog(int? type, string logOperator, string startTime, string endTime)
        {
            List<Log.Entity.LogEntity> logList = Log.Service.LogService.SearchList(type, logOperator, startTime, endTime);
            string excelPath = HttpContext.Server.MapPath("~/Excel");

            if (!System.IO.Directory.Exists(excelPath))
            {
                System.IO.Directory.CreateDirectory(excelPath);
            }

            List<ColHeader> colHeaderList = new List<ColHeader>();
            ExcelOpenXml excel = new ExcelOpenXml(excelPath);

            colHeaderList.Add(new ColHeader("Id", "序号", ColDataType.Number) { CustomHeaderFunc = CellFormat });
            colHeaderList.Add(new ColHeader("TypeExp", "日志类型", ColDataType.String) { CustomHeaderFunc = CellFormat });
            colHeaderList.Add(new ColHeader("OperatorExp", "操作人", ColDataType.String) { CustomHeaderFunc = CellFormat });
            colHeaderList.Add(new ColHeader("OperateModule", "操作模块", ColDataType.String) { CustomHeaderFunc = CellFormat });
            colHeaderList.Add(new ColHeader("OperateTimeExp", "操作时间", ColDataType.String) { CustomHeaderFunc = CellFormat });
            colHeaderList.Add(new ColHeader("Msg", "日志内容", ColDataType.String) { CustomHeaderFunc = CellFormat });

            excel.ExportToExcel<Log.Entity.LogEntity>(logList, colHeaderList, "日志", null);
        }

        // 保存权限
        [HttpPost]
        public JsonResult SaveRight(string dataJson)
        {
            bool state = true;
            string msg = string.Empty;
            Right.Entity.RightEntity right = null;

            try
            {
                string badge = HttpContext.User.Identity.Name;
                right = Service.RightService.SaveRight(badge, dataJson, out state, out msg);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = right } };
        }

        // 删除权限
        [HttpPost]
        public JsonResult DeleteRight(string ids)
        {
            bool state = true;
            string msg = string.Empty;

            try
            {
                string badge = HttpContext.User.Identity.Name;
                Service.RightService.DeleteRight(badge, ids, out state, out msg);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg } };
        }

        // 获取权限列表
        public JsonResult GetRightList(int pageIndex, int pageSize, string rightUser)
        {
            bool state = true;
            string msg = string.Empty;
            int total = 0;
            List<Right.Entity.RightEntity> rightList = null;

            try
            {
                rightList = Service.RightService.SearchList(rightUser);
                total = rightList.Count;
                rightList = rightList.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = rightList, total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // 获取单个权限信息
        public JsonResult GetRightById(int id)
        {
            bool state = true;
            string msg = string.Empty;
            Right.Entity.RightEntity entity = null;

            try
            {
                entity = Right.Entity.RightEntity.GetSingle(id);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = entity }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // 表格格式化样式
        private void CellFormat(Cell cell)
        {
            cell.StyleIndex = (uint)DogNet.Common.ExcelOperation.DefaultStyle.粗体黑字绿底;
        }
    }
}
