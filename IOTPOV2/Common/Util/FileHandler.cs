using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common.Util
{
    public class FileHandler
    {
        public static string GetFileIcon(string fileName)
        {
            string fileIcon = string.Empty;
            string extName = fileName.Substring(fileName.LastIndexOf('.'));

            switch (extName.ToLower())
            {
                case ".xls":
                    fileIcon = "icon-xls";
                    break;
                case ".xlsx":
                    fileIcon = "icon-xlsx";
                    break;
                case ".doc":
                    fileIcon = "icon-doc";
                    break;
                case ".docx":
                    fileIcon = "icon-docx";
                    break;
                case ".ppt":
                    fileIcon = "icon-ppt";
                    break;
                case ".pptx":
                    fileIcon = "icon-pptx";
                    break;
                case ".pdf":
                    fileIcon = "icon-pdf";
                    break;
                case ".txt":
                    fileIcon = "icon-txt";
                    break;
                case ".xml":
                    fileIcon = "icon-xml";
                    break;
                case ".csv":
                    fileIcon = "icon-csv";
                    break;
                case ".zip":
                case ".7z":
                    fileIcon = "icon-zip";
                    break;
                case ".rar":
                    fileIcon = "icon-rar";
                    break;
                case ".png":
                    fileIcon = "icon-png";
                    break;
                case ".jpg":
                case ".jpeg":
                    fileIcon = "icon-jpg";
                    break;
                case ".gif":
                    fileIcon = "icon-gif";
                    break;
                case ".js":
                    fileIcon = "icon-js";
                    break;
                case ".css":
                    fileIcon = "icon-css";
                    break;
                default:
                    fileIcon = "icon-more";
                    break;
            }

            return fileIcon;
        }

        public static string getFileSize(long fileSize)
        {
            if (fileSize > 1024 * 1024)
            {
                double size = fileSize / 1024 / 1024;
                return size.ToString("0.00") + "MB";
            }
            else if (fileSize > 1024)
            {
                double size = fileSize / 1024;
                return size.ToString("0.00") + " KB";
            }
            else
            {
                return fileSize.ToString() + " B";
            }
        }
    }
}
