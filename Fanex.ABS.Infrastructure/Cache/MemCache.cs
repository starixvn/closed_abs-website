// ----------------------------------------------------------------------
// <copyright file="MemCache.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Cache
{
    using System;

    using Enyim.Caching;
    using Enyim.Caching.Memcached;

    public class MemCache : ICacheFactory
    {
        #region Constants and Fields

        private readonly MemcachedClient _cacheClient;

        #endregion

        #region Constructors and Destructors

        public MemCache()
        {
            if (this._cacheClient == null)
            {
                this._cacheClient = new MemcachedClient("memcached");
            }
        }

        #endregion

        #region Public Methods and Operators

        public bool Delete(string key)
        {
            return this._cacheClient.Remove(key);
        }

        public object Get(string key)
        {
            return this._cacheClient.Get(key);
        }

        public T Get<T>(string key)
        {
            return this._cacheClient.Get<T>(key);
        }

        public void Set(string key, object value)
        {
            this._cacheClient.Store(StoreMode.Set, key, value);
        }

        public void Set(string key, object value, TimeSpan expire)
        {
            this._cacheClient.Store(StoreMode.Set, key, value, expire);
        }

        public void Set<T>(string key, T value)
        {
            this._cacheClient.Store(StoreMode.Set, key, value);
        }

        public void Set<T>(string key, T value, TimeSpan expire)
        {
            this._cacheClient.Store(StoreMode.Set, key, value);
        }

        #endregion
    }
}