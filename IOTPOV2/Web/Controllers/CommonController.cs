using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class CommonController : Controller
    {
        private static string AttachmentPath = System.Configuration.ConfigurationManager.AppSettings["AttachmentPath"];
        private static string FilePath = System.Configuration.ConfigurationManager.AppSettings["FilePath"];
        //
        // GET: /Common/

        public JsonResult UploadAttachment()
        {
            bool state = true;
            string msg = string.Empty;
            List<Common.Entity.AttachmentEntity> fileList = new List<Common.Entity.AttachmentEntity>();

            try
            {
                HttpFileCollectionBase files = Request.Files;

                if (files.Count == 0)
                {
                    state = false;
                    msg = "没有附件";
                }
                else
                {
                    string dirPath = Common.Util.Util.CreateDirectory(AttachmentPath, true);

                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];

                        Common.Entity.AttachmentEntity AttachmentEntity = new Common.Entity.AttachmentEntity
                        {
                            FileName = Path.GetFileName(file.FileName),
                            FileType = Path.GetExtension(file.FileName),
                            FileAddress = dirPath + Guid.NewGuid().ToString() + Path.GetExtension(file.FileName),
                            Creator = HttpContext.User.Identity.Name,
                            CreateTime = DateTime.Now
                        };

                        file.SaveAs(AttachmentEntity.FileAddress);
                        FileInfo fileInfo = new FileInfo(AttachmentEntity.FileAddress);
                        AttachmentEntity.FileSize = fileInfo.Length;

                        state = AttachmentEntity.Save(out msg);

                        //出错则终止上传
                        if (!state)
                        {
                            fileInfo.Delete();
                            break;
                        }

                        fileList.Add(AttachmentEntity);
                    }
                }
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = fileList }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

         

        // Get: 附件下载
        public void DownloadAttachment(int id)
        {
            string msg = string.Empty;
            Common.Entity.AttachmentEntity file = Common.Entity.AttachmentEntity.GetSingle(id);

            if (file != null && System.IO.File.Exists(file.FileAddress))
            {
                Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(file.FileName));
                Response.ContentType = "application/octet-stream";
                Response.WriteFile(file.FileAddress);
            }
            else
            {
                Response.Write("文件不存在，请联系管理员！");
                Response.End();
            }
        }

        public JsonResult DeleteAttachment(string instanceId, string type, string id)
        {
            string msg = string.Empty;
            bool state = false;
            Common.Entity.AttachmentEntity file = Common.Entity.AttachmentEntity.GetSingle(id);

            if (file != null && System.IO.File.Exists(file.FileAddress))
            {
                System.IO.File.Delete(file.FileAddress);
                file.Delete(out msg);

                //删除

                state = true;

            }
            else
            {
                msg = "文件不存在，请联系管理员！";
                state = false;
            }
            return new JsonResult { Data = new { state = state, msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // GET: 文件上传（文档包含的文件）
        public JsonResult UploadFile()
        {
            bool state = true;
            string msg = string.Empty;
            List<Dictionary<string, string>> fileInfoList = new List<Dictionary<string, string>>();

            try
            {
                HttpFileCollectionBase files = Request.Files;

                if (files.Count == 0)
                {
                    state = false;
                    msg = "没有附件";
                }
                else
                {
                    string dirPath = Common.Util.Util.CreateDirectory(FilePath, false);

                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];
                        Dictionary<string, string> fileInfo = new Dictionary<string, string>();
                        string fileAddress = dirPath + Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        fileInfo["FileAddress"] = fileAddress.Substring(FilePath.Length);
                        fileInfo["FileName"] = file.FileName;

                        file.SaveAs(fileAddress);
                        fileInfoList.Add(fileInfo);
                    }
                }
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg, data = fileInfoList }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        //public JsonResult GetProductLine()
        //{
        //    bool state = true;
        //    string msg = string.Empty;
        //    //var api = new Product.Api.Server.ProductApi();
        //    //var productlines = api.GetDefinedParam("productline");
        //    //  var erp_productlines = Product.Services.ParamService.GetERPCpx();

        //    //return new JsonResult { Data = new { state = state, msg = msg, data = productlines }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        //}

        /// <summary>
        /// 跨域iframe请求代理
        /// 将数据post到iframe中
        /// </summary>
        /// <param name="callback"></param>
        /// <returns></returns>

        public ActionResult ProxyPage(string callback)
        {
            if (Request.HttpMethod.ToUpper() == "POST")
            {
                ViewBag.callback = callback;
                ViewBag.selectData = Request.Form["selectData"];
                return View();
            }
            else
            {
                return null;
            }
        }
    }
}
