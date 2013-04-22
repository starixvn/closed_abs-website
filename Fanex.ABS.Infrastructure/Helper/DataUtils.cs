// ----------------------------------------------------------------------
// <copyright file="DataUtils.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Sunplus.Accounting.Core.Helper
{
    using System.Collections.Generic;
    using System.Data;

    /// <summary>
    /// DataUtils Oject 
    /// </summary>
    public class DataUtils
    {
        #region Public Methods and Operators

        /// <summary>
        /// Determines whether [is exist key] [the specified dr].
        /// </summary>
        /// <param name="dr">The dr.</param>
        /// <param name="key">The key.</param>
        /// <returns>
        ///   <c>true</c> if [is exist key] [the specified dr]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsExistKey(DataRow dr, string key)
        {
            try
            {
                string value = dr[key].ToString();
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Determines whether [is exist key] [the specified dr].
        /// </summary>
        /// <param name="dr">The dr.</param>
        /// <param name="key">The key.</param>
        /// <returns>
        ///   <c>true</c> if [is exist key] [the specified dr]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsExistKey(Dictionary<string, double> dr, string key)
        {
            try
            {
                string value = dr[key].ToString();
                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion
    }
}