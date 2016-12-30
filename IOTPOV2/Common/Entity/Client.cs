using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common.Entity
{
    [RepositoryEntity(DefaultConnName = "POV")]
    [PetaPoco.TableName("Client")]
    [PetaPoco.PrimaryKey("Id")]
    public class Client : Repository<Client>
    {
        public int Id { get; set; }
        public string WeixinOpenId { get; set; }
        public string TargetPovID { get; set; }
        public long ShowTime { get; set; }
        public bool IsPay { get; set; }

        public bool IsPlay { get; set; }

        public DateTime PlanPlayStartTime { get; set; }

        public DateTime PlanPlayEndTime { get; set; }

        public DateTime PlayStartTime { get; set; }

        public DateTime PlayEndTime { get; set; }

        public string Image { get; set; }
    }
}
