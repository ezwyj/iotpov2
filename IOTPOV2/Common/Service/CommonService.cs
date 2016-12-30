using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Common.Entity;

namespace Common.Service
{
    public class CommonService
    {
        public void AddDevice(PovDevice device,out string msg)
        {
            try
            {
                device.Save(out msg);
            }
            catch (Exception e)
            {
                msg = e.Message;
            }
        }
        public void EditDevice(PovDevice device,out string msg)
        {
            try
            {
                device.Save(out msg);
            }
            catch (Exception e)
            {
                msg = e.Message;
            }
        }
        public void DeleteDevice(PovDevice device, out string msg)
        {
            try
            {
                device.Delete(out msg);
            }
            catch(Exception e)
            {
                msg = e.Message;
            }
        }

        public bool AddBasicImage(string povDeviceId,Client entity)
        {
            bool Result = false;
            string msg = string.Empty;
            //检查完整性



            entity.Save(out msg);
            if (string.IsNullOrEmpty(msg))
            {
                Result =  true;
            }
            return Result;
        }

        public bool Pay(int clientId,out string msg)
        {
            throw new NotImplementedException();
        }
    }
}
