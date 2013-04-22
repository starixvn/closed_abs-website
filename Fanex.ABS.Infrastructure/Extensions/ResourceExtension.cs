// ----------------------------------------------------------------------
// <copyright file="ResourceExtension.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System;
    using System.Web;

    public class ResourceExtension
    {
        #region Enums

        public enum Resources
        {
            ErrorMessage,

            Common,

            Viewlog
        }

        #endregion

        #region Public Methods and Operators

        public static string GetResourceValue(Resources resource, string key)
        {
            try
            {
                object globalResourceObject = HttpContext.GetGlobalResourceObject(resource.ToString(), key);
                if (globalResourceObject != null)
                {
                    return globalResourceObject.ToString();
                }
            }
            catch (Exception)
            {
                throw new Exception("Key: " + key + " does not exist in resource: " + resource.ToString());
            }

            return string.Empty;
        }

        #endregion
    }
}