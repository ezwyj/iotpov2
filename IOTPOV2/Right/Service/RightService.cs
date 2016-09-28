using Account.Entity;
using Account.Service;
using Common.Util;
using Log.Entity;
using Log.Service;
using Right.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Service
{
    public class RightService
    {
        public static RightEntity SaveRight(string badge, string dataJson, out bool state, out string msg)
        {
            RightEntity right = Serializer.ToObject<RightEntity>(dataJson);

            right.Operator = badge;
            right.OperateTime = DateTime.Now;

            if (RightEntity.DefaultDB.IsNew(right))
            {
                if (RightEntity.GetListByProperty(a => a.RightUser, right.RightUser).Count > 0)
                {
                    state = false;
                    msg = "员工" + right.RightUserExp + "权限已存在！";
                }
                else
                {
                    state = right.Save(out msg);
                    LogService.WriteLog(LogTypeEnum.操作日志, "权限管理", "新增权限：" + badge + "为" + right.RightUser + "分配了 " + right.RightName + " 权限");
                }
            }
            else
            {
                RightEntity oldRight = RightEntity.GetSingle(right.Id);

                right.RightUser = oldRight.RightUser;
                state = right.Save(out msg);
                LogService.WriteLog(LogTypeEnum.操作日志, "权限管理", "修改权限：" + badge + "修改了" + right.RightUser + "的权限，从 " + oldRight.RightName + " 修改到 " + right.RightName);
            }

            return right;
        }

        public static void DeleteRight(string badge, string ids, out bool state, out string msg)
        {
            List<string> idList = ids.Split(',').ToList();
            state = true;
            msg = string.Empty;

            foreach (var id in idList)
            {
                RightEntity right = RightEntity.GetSingle(id);
                string rightUser = right.RightUser;
                state = right.Delete(out msg);

                if (state)
                {
                    LogService.WriteLog(LogTypeEnum.操作日志, "权限管理", "删除权限：" + badge + "删除了" + rightUser + "的权限 ");
                }
                else
                {
                    break;
                }
            }
        }

        public static List<RightEntity> SearchList(string rightUserId)
        {
            string sql = "select * from npi_right where 1=1";

            if (!string.IsNullOrEmpty(rightUserId))
            {
                List<UserEntity> userList = UserEntity.GetListByProperty(a=>a.Id, rightUserId);
                List<string> filter = new List<string>();

                foreach (var user in userList)
                {
                    filter.Add("RightUser = '" + user.Name + "'");
                }

                if (filter.Count > 0)
                {
                    sql += " and (" + string.Join(" or ", filter) + ")";
                }
                else
                {
                    sql += " and 1=2";
                }
            }

            return RightEntity.DefaultDB.Fetch<RightEntity>(sql);
        }

        public static bool IsHaveRight(string badge, string rightName)
        {
            RightEntity right = RightEntity.GetListByProperty(a => a.RightUser, badge).FirstOrDefault();

            return right != null && right.RightName.Contains(rightName);
        }
    }
}
