using Common.Util;
using Log.Entity;
using Log.Service;
using ValueSet.Entity;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ValueSet.Service
{
    public class ValueSetService
    {
        public static List<ValueSetEntity> GetSetList()
        {
            List<ValueSetEntity> entityList = ValueSetEntity.GetListByProperty(a => a.SetId, 0);

            return entityList;
        }

        public static List<ValueSetEntity> GetValueList(int id, bool isEnable = false)
        {
            List<ValueSetEntity> list = ValueSetEntity.GetListByProperty(a => a.SetId, id);

            if (isEnable)
            {
                list = list.FindAll(a => a.IsEnable == true);
            }

            return list;
        }

        public static ValueSetEntity SaveValueSet(string valueSetJson, out bool state, out string msg)
        {
            state = false;
            msg = string.Empty;
            ValueSetEntity entity = new ValueSetEntity();

            try
            {
                entity = Serializer.ToObject<ValueSetEntity>(valueSetJson);
                string log = string.Empty;

                if (ValueSetEntity.DefaultDB.IsNew(entity))
                {
                    state = entity.Save(out msg);
                    log = "设置值集：" + entity.Text + "(" + entity.Id + ")";
                }
                else
                {
                    ValueSetEntity oldEntity = ValueSetEntity.GetSingle(entity.Id);
                    List<string> changeList = new List<string>();

                    if (oldEntity.Value != entity.Value)
                    {
                        changeList.Add("值从 " + oldEntity.Value + " 修改为 " + entity.Value);
                    }
                    if (oldEntity.Text != entity.Text)
                    {
                        changeList.Add("文本从 " + oldEntity.Text + " 修改为 " + entity.Text);
                    }
                    if (oldEntity.SortId != entity.SortId)
                    {
                        changeList.Add("排序从 " + oldEntity.SortId + " 修改为 " + entity.SortId);
                    }
                    if (oldEntity.IsEnable != entity.IsEnable)
                    {
                        changeList.Add("启用状态从 " + (oldEntity.IsEnable ? "是" : "否") + " 修改为 " + (entity.IsEnable ? "是" : "否"));
                    }
                    if (oldEntity.IsDefault != entity.IsDefault)
                    {
                        changeList.Add("默认状态从 " + (oldEntity.IsDefault ? "是" : "否") + " 修改为 " + (entity.IsDefault ? "是" : "否"));
                    }
                    if (oldEntity.Extra != entity.Extra)
                    {
                        changeList.Add("扩展信息从 " + oldEntity.Extra + " 修改为 " + entity.Extra);
                    }


                    if (changeList.Count != 0)
                    {
                        log = "设置值集：" + entity.Text + "(" + entity.Id + ")：" + string.Join(";", changeList);
                    }

                    state = entity.Save(out msg);
                }

                LogService.WriteLog(LogTypeEnum.操作日志, "值集设置", log);
            }
            catch (Exception e)
            {
                msg = e.Message;
            }

            return entity;
        }

        public static bool Delete(string id, out string msg)
        {
            bool state = true;
            msg = string.Empty;
            Database db = ValueSetEntity.DefaultDB;

            db.BeginTransaction();
            try
            {
                ValueSetEntity entity = ValueSetEntity.GetSingle(id);

                if (entity.SetId == 0)
                {
                    string sql = "delete npi_valueSet where SetId=" + entity.Id;

                    db.Execute(sql);
                }

                db.Delete(entity);
                db.CompleteTransaction();

                LogService.WriteLog(LogTypeEnum.操作日志, "值集设置", "删除值集：" + entity.Text + "(" + entity.Id + ")");
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
                db.AbortTransaction();
            }

            return state;
        }
    }
}
