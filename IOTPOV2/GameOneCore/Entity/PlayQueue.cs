using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameOneCore.Entity
{
    public class PlayQueue
    {
        public DateTime PlayTime { get; set; }
        public List<PlayItem> Pictures { get; set; }
       
    }
}
