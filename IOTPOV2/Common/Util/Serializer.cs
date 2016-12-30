using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace Common.Util
{
    public class Serializer
    {
        public static string ToJson<T>(T obj)
        {
            string str = JsonConvert.SerializeObject(obj);

            return str;
        }

        public static T ToObject<T>(string json)
        {


            T obj = JsonConvert.DeserializeObject<T>(json);


            return obj;
        }
    }
}
