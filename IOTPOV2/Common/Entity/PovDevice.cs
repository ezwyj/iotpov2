using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common.Entity
{
    [RepositoryEntity(DefaultConnName = "POV")]
    [PetaPoco.TableName("PovDevice")]
    [PetaPoco.PrimaryKey("Id")]
    public class PovDevice :Repository<PovDevice>
    {
        public int Id { get; set; }

        public string ShopName { get; set; }

        public string Number { get; set; }

        public string Address { get; set; }


    }
}
