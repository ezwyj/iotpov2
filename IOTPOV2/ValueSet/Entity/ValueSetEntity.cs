using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaPoco;

namespace ValueSet.Entity
{
    [RepositoryEntity(DefaultConnName = "POV")]
    [PetaPoco.TableName("ValueSet")]
    [PetaPoco.PrimaryKey("Id")]
    public class ValueSetEntity : Repository<ValueSetEntity>
    {
        public int Id { get; set; }
        public int SetId { get; set; }
        public string Value { get; set; }
        public string Text { get; set; }
        public bool IsEnable { get; set; }
        public bool IsDefault { get; set; }
        public int SortId { get; set; }
        public string Extra { get; set; }
    }
}

