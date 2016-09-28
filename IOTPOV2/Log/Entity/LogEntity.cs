using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaPoco;
using Account.Entity;
using Account.Service;

namespace Log.Entity
{
    [RepositoryEntity(DefaultConnName = "Log")]
    [PetaPoco.TableName("Log_log")]
    [PetaPoco.PrimaryKey("Id")]
    public class LogEntity : Repository<LogEntity>
    {
        public int Id { get; set; }
        public LogTypeEnum Type { get; set; }
        public string Operator { get; set; }
        public string OperateModule { get; set; }
        public DateTime OperateTime { get; set; }
        public string Msg { get; set; }

        [PetaPoco.Ignore]
        public string TypeExp
        {
            get
            {
                return Enum.GetName(typeof(LogTypeEnum), Type);
            }
        }

        [PetaPoco.Ignore]
        public string OperatorExp
        {
            get
            {
                UserEntity user = UserEntity.GetSingle(Operator);

                return user != null ? user.Name : "";
            }
        }

        [PetaPoco.Ignore]
        public string OperateTimeExp
        {
            get
            {
                return OperateTime.ToString();
            }
        }
    }

    public enum LogTypeEnum
    {
        操作日志 = 1,
        系统日志 = 2,
        错误日志 = 3
    }
}
