using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Common.Entity;

namespace Common.Service
{
    public class DeviceService
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

        
    }
}
