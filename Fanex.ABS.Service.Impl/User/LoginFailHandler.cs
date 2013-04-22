// ----------------------------------------------------------------------
// <copyright file="LoginFailHandler.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.User
{
    using System;
    using System.Configuration;
    using System.Runtime.Serialization;

    using DNAide.Core;

    using Fanex.ABS.Entities;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Infrastructure.Constant;

    /// <summary>
    /// Summary description for LoginFailedHandler
    /// </summary>
    public class LoginFailHandler
    {
        #region Public Methods and Operators

        public static string GetRemainingTime(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return string.Empty;
            }

            LogFailedInformation info = GetInformation(username);
            if (info != null)
            {
                TimeSpan timeSpan = info.UnLockTime - DateTime.Now;
                return timeSpan.Minutes + ";" + timeSpan.Seconds;
            }

            return string.Empty;
        }

        /// <summary>
        /// Before pass info through into DB, we will invoke this function to check "Reach max times wrong password."
        /// Get info of this username from the caching server.
        /// If (this username is being locked)//Reach max times wrong password.
        /// {
        ///     Lock UI
        ///     Show count down time in web page.
        /// }
        /// else
        /// {
        ///     Normal process(pass info throug int DB)
        /// }
        /// </summary>
        /// <param name="username"></param>
        public static bool IsLocked(string username)
        {
            return CheckReachMaxLoginTimes(username);
        }

        /// <summary>
        /// User login failed.
        /// If (username is existed in Database)
        /// {
        ///     If ("log failed info" of this user has existed on the caching server)
        ///     {
        ///         Increase counter, update logtime
        ///     }
        ///     Else
        ///     {
        ///         Add "log failed info" of this user into the caching server.
        ///     }
        ///  }
        ///  Else//User is not exist in Database
        ///  {
        ///  }
        /// </summary>
        /// <param name="username"></param>
        public static void LoginFailed(string username, int ErrorCode)
        {
            if (ErrorCode == 103) //User is existed in database
            {
                IncreaseCount(username);
            }
            else if (ErrorCode == 101) //User is not exist in database
            {
            }
        }

        /// <summary>
        /// User login success.
        /// Remove all log info about "failed login previous" in the caching server.
        /// </summary>
        /// <param name="username">username</param>
        public static void LoginSuccess(string username)
        {
            RemoveLoginInformation(username);
        }

        public static Result WriteJS(string username)
        {
            var result = new Result();
            var strDownTime = GetRemainingTime(username);
            result.LockInfo.Minute = CastAide.AsInt32(strDownTime.Split(';')[0]);
            result.LockInfo.Second = CastAide.AsInt32(strDownTime.Split(';')[1]);
            result.ErrorCode = ErrorCode.ERR_EXCEED_LOGIN;
            result.ErrorMessage = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage,
                                                               "errExccedWrongLogin");
            return result;
        }

        #endregion

        #region Methods

        private static void AddLoginInformation(string username)
        {
            CacheService.Set(
                GetKey(username),
                new LogFailedInformation { UserName = username, Count = 1, LoginTime = DateTime.Now },
                new TimeSpan(0, 100, 0));
        }

        private static bool CheckReachMaxLoginTimes(string username)
        {
            LogFailedInformation info = GetInformation(username);
            if (info != null && info.Count == CastAide.AsInt32(ConfigurationManager.AppSettings["NumberWrongPassword"]))
            {
                if (info.UnLockTime < DateTime.Now)
                {
                    RemoveLoginInformation(username);
                    return false;
                }

                return true;
            }

            return false;
        }

        private static int GetCount(string username)
        {
            LogFailedInformation info = GetInformation(username);
            if (info == null)
            {
                return 0;
            }

            return info.Count;
        }

        private static LogFailedInformation GetInformation(string username)
        {
            return CacheService.Get<LogFailedInformation>(GetKey(username));
        }

        private static string GetKey(string username)
        {
            return "abs.login_failed_" + username.ToLower().Replace(" ","_");
        }

        private static void IncreaseCount(string username)
        {
            if (GetInformation(username) == null)
            {
                AddLoginInformation(username);
            }
            else
            {
                CacheService.Set(
                    GetKey(username),
                    new LogFailedInformation
                        {
                            UserName = username,
                            Count = GetCount(username) + 1,
                            LoginTime = DateTime.Now,
                            UnLockTime =
                                DateTime.Now.AddMinutes(
                                    CastAide.AsInt32(ConfigurationManager.AppSettings["loginfailed_countdown_minute"]))
                        });
            }
        }

        private static bool RemoveLoginInformation(string username)
        {
            CacheService.Delete(GetKey(username));
            return true;
        }

        #endregion
    }

    public class LogFailedInformation
    {
        #region Public Properties
     
        public int Count { get; set; }

  
        public int LogID { get; set; }

  
        public DateTime LoginTime { get; set; }

   
        public DateTime UnLockTime { get; set; }

        public string UserName { get; set; }

        #endregion
    }
}