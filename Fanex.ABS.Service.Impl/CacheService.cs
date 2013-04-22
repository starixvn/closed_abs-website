// ----------------------------------------------------------------------
// <copyright file="CacheService.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl
{
    using System;
    using Fanex.ABS.Infrastructure.Cache;
    using Fanex.Caching;

    public static class CacheService
    {
        private static readonly ICache _cache;

        static CacheService()
        {
            _cache = Caching.CacheService.CreateInstance(CacheType.MemCache);
        }

        public static object Get(string key)
        {
            try
            {
                return _cache.Get<object>(key);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static void Set(string key, object value)
        {
            try
            {
                _cache.Set(key, value);
            }
            catch (Exception)
            {
            }
        }

        public static T Get<T>(string key)
        {
            return _cache.Get<T>(key);
        }

        public static void Set<T>(string key, T value)
        {
            _cache.Set<T>(key, value);
        }

        public static void Set(string key, object value, TimeSpan expire)
        {
            _cache.Set(key, value, expire);
        }

        public static void Set<T>(string key, T value, TimeSpan expire)
        {
            _cache.Set<T>(key, value, expire);
        }

        public static void Delete(string key)
        {
            _cache.Remove(key);
        }
    }
}