// ----------------------------------------------------------------------
// <copyright file="UnderMaintenanceService.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl
{
    using System;
    using System.Configuration;

    using LoadBalancerLibrary;

    public class UnderMaintenanceService
    {
        #region Constants and Fields

        private static string _from = string.Empty;

        private static string _to = string.Empty;

        #endregion

        #region Public Properties

        public static string From
        {
            get
            {
                return _from;
            }

            set
            {
                _from = value;
            }
        }

        public static string To
        {
            get
            {
                return _to;
            }

            set
            {
                _to = value;
            }
        }

        public static string UMService
        {
            get
            {
                return ConfigurationManager.AppSettings["UMService"];
            }
        }

        public static bool isUMTime
        {
            get
            {
                return ConfigurationManager.AppSettings["UM"] == "1";
            }
        }

        #endregion

        #region Public Methods and Operators

        public static bool GetDownTime()
        {
            bool isUM;

            LoadBalancer LB;
            LB = (LoadBalancer)Activator.GetObject(typeof(LoadBalancer), UMService);
            isUM = LB.isUnderMaintainence(IBCSites.Agency);

            if (isUM)
            {
                string[] UMTime = LB.GetUMTimeSetting();
                _from = UMTime[0];
                _to = UMTime[1];
            }

            return isUM;
        }

        #endregion
    }
}