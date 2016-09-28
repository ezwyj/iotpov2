using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaPoco;
using Account.Entity;

namespace Right.Entity
{
    [RepositoryEntity(DefaultConnName = "POV")]
    [PetaPoco.TableName("right")]
    [PetaPoco.PrimaryKey("Id")]
    public class RightEntity : Repository<RightEntity>
    {
        public int Id { get; set; }
        public string Operator { get; set; }
        public DateTime OperateTime { get; set; }
        public string RightUser { get; set; }
        public string RightName { get; set; }

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

        [PetaPoco.Ignore]
        public string RightUserExp
        {
            get
            {
                UserEntity user = UserEntity.GetSingle(RightUser);

                return user != null ? user.Name : "";
            }
        }
    }
}
