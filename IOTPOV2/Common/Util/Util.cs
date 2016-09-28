using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Common.Util
{
    public class Util
    {
        public static string GetFileImgIcon(string extName)
        {
            var className = "";

            switch (extName.ToLower())
            {
                case ".xls":
                    className = "icon-xls";
                    break;
                case ".xlsx":
                    className = "icon-xlsx";
                    break;
                case ".doc":
                    className = "icon-doc";
                    break;
                case ".docx":
                    className = "icon-docx";
                    break;
                case ".ppt":
                    className = "icon-ppt";
                    break;
                case ".pptx":
                    className = "icon-pptx";
                    break;
                case ".pdf":
                    className = "icon-pdf";
                    break;
                case ".txt":
                    className = "icon-txt";
                    break;
                case ".xml":
                    className = "icon-xml";
                    break;
                case ".csv":
                    className = "icon-csv";
                    break;
                case ".zip":
                case ".7z":
                    className = "icon-zip";
                    break;
                case ".rar":
                    className = "icon-rar";
                    break;
                case ".png":
                    className = "icon-png";
                    break;
                case ".jpg":
                case ".jpeg":
                    className = "icon-jpg";
                    break;
                case ".gif":
                    className = "icon-gif";
                    break;
                case ".js":
                    className = "icon-js";
                    break;
                case ".css":
                    className = "icon-css";
                    break;
                default:
                    className = "icon-more";
                    break;
            }

            return "<span class=\"icon " + className + "\"></span>";
        }

        public static string CreateDirectory(string rootPath, bool isRelativePath)
        {
            string dirPath = string.Empty;
            DateTime now = DateTime.Now;

            if (isRelativePath)
            {
                dirPath = System.Web.HttpContext.Current.Server.MapPath("~/" + rootPath);
            }
            else
            {
                dirPath = rootPath;
            }

            dirPath += now.Year + "\\" + now.Month + "\\" + now.Day + "\\";

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            return dirPath;
        }

        /// <summary>
        /// 格式化html字符换
        /// </summary>
        /// <param name="htmlString"></param>
        /// <returns></returns>
        public static string FormatHtmlString(string htmlString)
        {
            if (!string.IsNullOrEmpty(htmlString))
            {
                htmlString = htmlString.Replace("\n", "<br>");
                htmlString = htmlString.Replace("\t", "    ");
            }

            return htmlString;
        }
    }
}
