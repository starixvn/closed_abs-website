// ----------------------------------------------------------------------
// <copyright file="DateTimeExtension.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System;
    using System.Diagnostics;

    public static class DateTimeExtension
    {
        #region Constants and Fields

        private static readonly DateTime MaxDate = new DateTime(9999, 12, 31, 23, 59, 59, 999);

        private static readonly DateTime MinDate = new DateTime(1900, 1, 1);

        #endregion

        #region Public Methods and Operators

        [DebuggerStepThrough]
        public static bool IsValid(this DateTime target)
        {
            return (target >= MinDate) && (target <= MaxDate);
        }

        #endregion
    }
}