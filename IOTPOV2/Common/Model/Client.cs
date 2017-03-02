using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ProtoBuf;

namespace Common.Model
{

    [ProtoBuf.ProtoContract]
    public class Client 
    {
        [ProtoMember(1, IsRequired = true) ]
        public int Id { get; set; }
        [ProtoMember(2, IsRequired = false)]
        public string WeixinOpenId { get; set; }
        [ProtoMember(3)]
        public string WeixinImage { get; set; }
        [ProtoMember(4, IsRequired = false)]
        public DateTime PlanPlayStartTime { get; set; }
        [ProtoMember(5, IsRequired = false)]
        public DateTime PlanPlayEndTime { get; set; }
        [ProtoMember(6, IsRequired = false)]
        public DateTime PlayStartTime { get; set; }
        [ProtoMember(7,IsRequired =false)]
        public DateTime PlayEndTime { get; set; }
        [ProtoMember(8,IsRequired =true)  ]
        public string DeviceName { get; set; }
        [ProtoMember(9, IsRequired = false)]
        public string City { get; set; }
        [ProtoMember(10, IsRequired = true)]
        public List<string> ImageLines { get; set; }
     

    }
}
