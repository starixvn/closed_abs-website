// ----------------------------------------------------------------------
// <copyright file="ICacheFactory.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Cache
{
    using System;

    public interface ICacheFactory
    {
        #region Public Methods and Operators

        bool Delete(string key);

        object Get(string key);

        T Get<T>(string key);

        void Set(string key, object value);

        void Set(string key, object value, TimeSpan expire);

        void Set<T>(string key, T value);

        void Set<T>(string key, T value, TimeSpan expire);

        #endregion
    }
}