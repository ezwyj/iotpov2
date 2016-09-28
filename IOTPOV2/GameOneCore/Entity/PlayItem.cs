using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Entity;

namespace GameOneCore.Entity
{
    public class PlayItem
    {
        public int Order { get; set; }        
        List<PicturePixel> _picture  = new List<PicturePixel>();
        List<PicturePixel> Picture
        {
            set { _picture = value; }
            get { return _picture;  }
        }

        public string BindDeviceId { get; set; }


    }
}
