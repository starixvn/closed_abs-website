// ----------------------------------------------------------------------
// <copyright file="SessionExtension.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System.Web.SessionState;

    public static class SessionExtension
    {
        #region Delegates

        public delegate object UponCreate();

        #endregion

        #region Public Methods and Operators

        public static void AddSession(HttpSessionState sessionState, string key, object value)
        {
            sessionState[key] = value;
        }

        public static object GetSession(HttpSessionState sessionState, string key)
        {
            return sessionState[key];
        }

        public static T GetSessionClass<T>(this HttpSessionState session, string key, UponCreate uponCreate)
            where T : class
        {
            if (null == session[key])
            {
                var item = uponCreate() as T;
                session[key] = item;
                return item;
            }
            return session[key] as T;
        }

        public static T GetSessionValue<T>(this HttpSessionState session, string key, UponCreate uponCreate)
            where T : struct
        {
            if (null == session[key])
            {
                object item = uponCreate();
                session[key] = item;
                return (T)item;
            }
            return (T)session[key];
        }

        #endregion
    }
}