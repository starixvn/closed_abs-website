// ----------------------------------------------------------------------
// <copyright file="Permission.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.User
{
    using System.Collections.Generic;
    using System.Web;
    using System.Web.SessionState;
    using Fanex.ABS.Infrastructure.Constants;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Service.Interface.User;

    public class PermissionService
    {
        #region Public Methods and Operators

        public static bool GetHostPermission(string functionName, HttpSessionState sessionState)
        {
            object roleAccess = SessionExtension.GetSession(sessionState, SessionKey.UserRoleAccess);
            functionName = "[" + functionName + "]";

            if (roleAccess != null)
            {
                var dicRoleAccess = (Dictionary<string, int>)roleAccess;
                if (dicRoleAccess.ContainsKey(functionName.ToLower()))
                {
                    if (dicRoleAccess[functionName.ToLower()] == 3)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public static bool HasPermission(string functionName, HttpSessionState sessionState)
        {
            object roleAccess = SessionExtension.GetSession(sessionState, SessionKey.UserRoleAccess);
            if (roleAccess == null)
            {
                return false;
            }

            var dicRoleAccess = (Dictionary<string, int>)roleAccess;

            functionName = "[" + functionName + "]";
            return dicRoleAccess.ContainsKey(functionName.ToLower());
        }

        public static bool HasPermission(string functionName, Dictionary<string, int> dicRoleAccess)
        {
            functionName = "[" + functionName + "]";
            return dicRoleAccess.ContainsKey(functionName.ToLower());
        }

        public static bool HasPermissionOnPath(string path, Dictionary<string, int> pageAccess)
        {
            if (pageAccess == null)
            {
                return false;
            }
            return pageAccess.ContainsKey(path.ToLower().Trim());
        }

        #endregion Public Methods and Operators
    }
}