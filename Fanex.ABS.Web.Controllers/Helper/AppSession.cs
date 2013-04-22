namespace Fanex.ABS.Web.Controllers.Helper
{
    using System;
    using System.Collections.Generic;
    using System.Web;
    using System.Web.SessionState;

    using DNAide.Core;

    using Fanex.ABS.Entities.User;
    using Fanex.ABS.Infrastructure.Constants;

    public class AppSession
    {
        #region Public Properties

        public static List<MenuDetail> UserMenu
        {
            get
            {
                if (HttpContext.Current.Session[SessionKey.UserMenu] != null)
                {
                    return (List<MenuDetail>)HttpContext.Current.Session[SessionKey.UserMenu];
                }
                else
                {
                    return null;
                }
            }
            set
            {
                HttpContext.Current.Session[SessionKey.UserMenu] = value;
            }
        }

        /// <summary>
        /// Admin RoleId
        /// </summary>
        public static int UserRoleId
        {
            get
            {
                return CastAide.AsInt32(SessionKey.UserRoleId, 0);
            }
            set
            {
                HttpContext.Current.Session[SessionKey.UserRoleId] = value;
            }
        }

        public static int UserId
        {
            get
            {
                try
                {
                    return CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
            set
            {
                HttpContext.Current.Session[SessionKey.UserId] = value;
            }
        }

        public static int UserNetSessionId
        {
            get
            {
                return CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserNetSessionId], 0);
            }
            set
            {
                HttpContext.Current.Session[SessionKey.UserNetSessionId] = value;
            }
        }

        public static string Username
        {
            get
            {
                return CastAide.AsString(HttpContext.Current.Session[SessionKey.Username]);
            }
            set
            {
                HttpContext.Current.Session[SessionKey.Username] = value;
            }
        }

        public static Dictionary<string, int> RoleAccess
        {
            get
            {
                return (Dictionary<string, int>)HttpContext.Current.Session[SessionKey.UserRoleAccess];
            }
            set
            {
                HttpContext.Current.Session[SessionKey.UserRoleAccess] = value;
            }
        }

        public static Dictionary<string, int> PageAccess
        {
            get
            {
                return (Dictionary<string, int>)HttpContext.Current.Session[SessionKey.PageAccess];
            }
            set
            {
                HttpContext.Current.Session[SessionKey.PageAccess] = value;
            }
        }

        public static object BalanceUpDay
        {
            get
            {
                return HttpContext.Current.Session[SessionKey.BalanceUpDay];
            }
            set
            {
                HttpContext.Current.Session[SessionKey.BalanceUpDay] = value;
            }
        }

        #endregion Public Properties

        #region Public Methods and Operators

        public static object GetSession(HttpSessionState sessionState, string key)
        {
            return sessionState[key];
        }

        #endregion Public Methods and Operators
    }
}