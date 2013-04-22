// -----------------------------------------------------------------------
// <copyright file="CommonService.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Text;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Infrastructure.Configurations;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Service.Interface;
    

    using Sunplus.UMControllerLibrary;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class CommonService : ICommonService
    {
        
        public Downtime GetDowntimeInfo()
        {
            bool isDowntime = false;

            var downTime = new Downtime
            {
                From = "0:00",
                To = "0:00",
                IsDowntime = false
            };

            var isUmTime = ConfigurationManager.AppSettings["UM"] == "1";


            if (!isUmTime)
                return downTime;

            string timeFrom = "", timeTo = "";

            var umCtrl = new UMBusiness();

            try
            {
                var umServiceUrl = ConfigurationManager.AppSettings["LBUrl"];

                isDowntime = umCtrl.isUnderMaintainence(Sites.AccountSite, umServiceUrl, ref timeFrom, ref timeTo);//Get Agnet Site UM Status.

                //isUM = false;

            }

            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }



            if (isDowntime)
            {

                downTime.From = timeFrom;
                downTime.To = timeTo;
                downTime.IsDowntime = true;
            }


            return downTime;
        }
    }
}