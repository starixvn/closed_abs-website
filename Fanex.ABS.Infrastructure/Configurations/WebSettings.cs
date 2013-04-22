// ----------------------------------------------------------------------
// <copyright file="WebSettings.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Configurations
{
    using System.Collections.Generic;
    using System.Configuration;
    using DNAide.Core;

    /// <summary>
    /// Summary description for Settings
    /// </summary>
    public static class WebSettings
    {
        #region Constants and Fields

        private static readonly int _CacheExpire;

        private static readonly int _deptId;

        private static readonly string _deptName;

        private static readonly string _iplocation;

        private static readonly string _ipvnreplace;

        private static readonly bool _isSslLogin;

        private static readonly int _serverId;

        private static readonly string _systemName;

        private static readonly string _theme;

        private static readonly string _version;

        private static readonly bool _IsUseMenuMVC;

        private static string _calendarTheme;

        public static List<string> NotAuthenticateAction { get; set; }

        #endregion Constants and Fields

        #region Constructors and Destructors

        static WebSettings()
        {
            _calendarTheme = ConfigurationManager.AppSettings["CalendarTheme"];
            _ipvnreplace = ConfigurationManager.AppSettings["ipvnreplace"];
            _isSslLogin = ConfigurationManager.AppSettings["ssl_login"] == "1";
            _CacheExpire = CastAide.AsInt32(ConfigurationManager.AppSettings["CacheExpire"]);
            _version = ConfigurationManager.AppSettings["version"];
            _iplocation = ConfigurationManager.AppSettings["iplocation"];
            _serverId = 0;
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["server_id"]))
            {
                int.TryParse(ConfigurationManager.AppSettings["server_id"], out _serverId);
            }
            _systemName = ConfigurationManager.AppSettings["SystemName"];
            _deptName = ConfigurationManager.AppSettings["DeptName"];
            _deptId = CastAide.AsInt16(ConfigurationManager.AppSettings["DeptId"]);
            _IsUseMenuMVC = ConfigurationManager.AppSettings["IsUseMenuMVC"] == "1";
            var exceptionAction = ConfigurationManager.AppSettings["NotAuthenticateAction"].Split(';');
            NotAuthenticateAction = new List<string>();
            if (exceptionAction.Length != 0)
            {
                foreach (var acction in exceptionAction)
                {
                    if (acction != null) NotAuthenticateAction.Add(acction.ToLower());
                }
            }
        }

        #endregion Constructors and Destructors

        #region Public Properties

        public static int CacheExpire
        {
            get
            {
                return _CacheExpire;
            }
        }

        public static int DeptId
        {
            get
            {
                return _deptId;
            }
        }

        public static string DeptName
        {
            get
            {
                return _deptName;
            }
        }

        public static string IPVNReplace
        {
            get
            {
                return _ipvnreplace;
            }
        }

        public static bool IsLocalTest
        {
            get
            {
                return ConfigurationManager.AppSettings["LocalTest"] == "1";
            }
        }

        public static bool IsSslLogin
        {
            get
            {
                return _isSslLogin;
            }
        }

        public static bool OpenMiniGame { get; set; }

        public static int ServerId
        {
            get
            {
                return _serverId;
            }
        }

        public static string SystemName
        {
            get
            {
                return _systemName;
            }
        }

        public static string Theme
        {
            get
            {
                return _theme;
            }
        }

        public static string Version
        {
            get
            {
                return _version;
            }
        }

        public static string ipLocation
        {
            get
            {
                return _iplocation;
            }
        }

        public static bool IsUseMenuMVC
        {
            get
            {
                return _IsUseMenuMVC;
            }
        }

        #endregion Public Properties
    }
}