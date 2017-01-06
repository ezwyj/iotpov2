using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web
{
    public class JobScheduler
    {
        public static void Start()
        {
          IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();

          IJobDetail job = JobBuilder.Create<ServiceMqttJob>().Build();

          ITrigger trigger = TriggerBuilder.Create()
            .WithIdentity("triggerName", "groupName")
            .WithSimpleSchedule(t =>
              t.WithIntervalInSeconds(1)
               .RepeatForever())
               .Build();

          scheduler.ScheduleJob(job ,trigger);
          scheduler.Start();
        }
      }
    }