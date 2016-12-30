using DogNet.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using PetaPoco;

namespace Common.Entity
{
    [RepositoryEntity(DefaultConnName = "POV")]
    [PetaPoco.TableName("Common_attachment")]
    [PetaPoco.PrimaryKey("Id")]
    public class AttachmentEntity : Repository<AttachmentEntity>
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public string FileAddress { get; set; }
        public string Creator { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
