using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaPoco;
using DogNet.Repositories;


namespace Account.Entity
{
    [RepositoryEntity(DefaultConnName = "POV")]
    [PetaPoco.TableName("User")]
    [PetaPoco.PrimaryKey("Id")]
    public class UserEntity : Repository<UserEntity>
    {
        [PetaPoco.Column("Id")]
        public int Id { get; set; }

        [PetaPoco.Column("Name")]
        public string Name { get; set; }

        [PetaPoco.Column("Role")]
        public string Role { get; set; }

        [PetaPoco.Column("Unit")]
        public string Unit
        {
            get;
            set;
        }
        public string Password { get; set; }

        public DateTime LastLoginTime { get; set; }


    }
}
