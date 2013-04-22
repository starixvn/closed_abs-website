// ----------------------------------------------------------------------
// <copyright file="CollectionExtension.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System.Collections.Generic;
    using System.Diagnostics;

    public static class CollectionExtension
    {
        #region Public Methods and Operators

        [DebuggerStepThrough]
        public static bool IsNullOrEmpty<T>(this ICollection<T> collection)
        {
            return (collection == null) || (collection.Count == 0);
        }

        #endregion
    }
}