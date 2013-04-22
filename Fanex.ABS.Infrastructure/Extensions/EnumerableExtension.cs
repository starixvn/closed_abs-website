// ----------------------------------------------------------------------
// <copyright file="EnumerableExtension.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;

    public static class EnumerableExtension
    {
        #region Public Methods and Operators

        [DebuggerStepThrough]
        public static void ForEach<T>(this IEnumerable<T> enumerable, Action<T> action)
        {
            foreach (T item in enumerable)
            {
                action(item);
            }
        }

        #endregion
    }
}