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
        [ProtoMember(1)]
        public int Id { get; set; }
        [ProtoMember(2)]
        public string WeixinOpenId { get; set; }
        [ProtoMember(3)]
        public string WeixinImage { get; set; }
        [ProtoMember(4)]
        public DateTime PlanPlayStartTime { get; set; }
        [ProtoMember(5)]
        public DateTime PlanPlayEndTime { get; set; }
        [ProtoMember(6)]
        public DateTime PlayStartTime { get; set; }
        [ProtoMember(7)]
        public DateTime PlayEndTime { get; set; }
        [ProtoMember(8)]
        public string DeviceName { get; set; }
        [ProtoMember(9)]
        public string City { get; set; }
        [ProtoMember(10)]
        public List<string> ImageLines { get; set; }

        [ProtoMember(11)]
        public List<KeyValuePair<string, DateTime>> Times { get; set; }
    }
}
