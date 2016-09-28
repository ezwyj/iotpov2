using Log.Entity;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Log.Service
{
    public class LogService
    {
        public static LogEntity WriteLog(LogTypeEnum logType, string operateModule, string logContent)
        {
            string msg = string.Empty;
            LogEntity log = new LogEntity
            {
                Type = logType,
                Operator = HttpContext.Current.User.Identity.Name,
                OperateModule = operateModule,
                OperateTime = DateTime.Now,
                Msg = logContent
            };

            log.Save(out msg);

            return log;
        }

        public static List<LogEntity> SearchList(int pageIndex, int pageSize, int? type, string logOperator, string startTime, string endTime, out long total)
        {
            string sql = "select * from npi_log where 1=1";

            if (type != null && type != 0)
            {
                sql += " and Type = " + type;
            }
            if (!string.IsNullOrEmpty(logOperator))
            {
                sql += " and Operator = " + logOperator;
            }
            if (!string.IsNullOrEmpty(startTime))
            {
                sql += " and DATEDIFF(D, '" + startTime + "', OperateTime) > 0";
            }
            if (!string.IsNullOrEmpty(endTime))
            {
                sql += " and DATEDIFF(D, '" + endTime + "', OperateTime) < 0";
            }

            sql += " order by OperateTime desc";

            Page<LogEntity> logPage = LogEntity.DefaultDB.Page<LogEntity>(pageIndex, pageSize, sql);
            total = logPage.TotalItems;

            return logPage.Items;
        }

        public static List<LogEntity> SearchList(int? type, string logOperator, string startTime, string endTime)
        {
            string sql = "select * from npi_log where 1=1";

            if (type != null && type != 0)
            {
                sql += " and Type = " + type;
            }
            if (!string.IsNullOrEmpty(logOperator))
            {
                sql += " and Operator = " + logOperator;
            }
            if (!string.IsNullOrEmpty(startTime))
            {
                sql += " and DATEDIFF(D, '" + startTime + "', OperateTime) > 0";
            }
            if (!string.IsNullOrEmpty(endTime))
            {
                sql += " and DATEDIFF(D, '" + endTime + "', OperateTime) < 0";
            }

            sql += " order by OperateTime desc";

            return LogEntity.DefaultDB.Fetch<LogEntity>(sql);
        }
    }
}
