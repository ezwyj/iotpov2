using Common.Logging;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;

namespace WindowsServiceIOTPOV
{
    public partial class ServiceChengdu : ServiceBase
    {
        private readonly ILog logger;
        private IScheduler scheduler;
        //时间间隔
        private readonly string StrCron = ConfigurationManager.AppSettings["cron"] == null ? "0/1 * * * * ?" : ConfigurationManager.AppSettings["cron"];

        public ServiceChengdu()
        {
            InitializeComponent();
            logger = LogManager.GetLogger(this.GetType());
             //新建一个调度器工工厂
             ISchedulerFactory factory = new StdSchedulerFactory();
             //使用工厂生成一个调度器
             scheduler = factory.GetScheduler();

        }

        protected override void OnStart(string[] args)
        {
            if (!scheduler.IsStarted)
            {
                 //启动调度器
                 scheduler.Start();
                 //新建一个任务
                 IJobDetail job = JobBuilder.Create<ServiceMqttJob>().WithIdentity("ServiceMqttJob", "ServiceMqttJobGroup").Build();
                 //新建一个触发器
                 ITrigger trigger = TriggerBuilder.Create().StartNow().WithCronSchedule(StrCron).Build();
                 //将任务与触发器关联起来放到调度器中
                 scheduler.ScheduleJob(job, trigger);
                 logger.Info("Quarzt 消息发送服务开启");
             }

        }

        protected override void OnStop()
        {
            if (!scheduler.IsShutdown)
             {
                 scheduler.Shutdown();
             }

        }
        /// <summary>
        /// 暂停
        /// </summary>
        protected override void OnPause()
        {
             scheduler.PauseAll();
             base.OnPause();
         }
         /// <summary>
         /// 继续
         /// </summary>
         protected override void OnContinue()
         {
             scheduler.ResumeAll();
             base.OnContinue();
         }

    }
}
