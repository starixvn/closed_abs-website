// ----------------------------------------------------------------------
// <copyright file="ReportHelper.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Helper
{
    using System;
    using System.Data;
    using DNAide.Core;
    using Fanex.ABS.DataAccess;
    using Fanex.ABS.DataAccess.Impl;
    using Nexcel.ABS.DataAccess.Interface;

    public static class ReportHelper
    {
        #region Constants and Fields

        private const string BalanceUpDayKey = "BalanceUpDay";

        private const string MoveBetsDayKey = "MoveBetsDay";

        private static readonly IHelperDataAccess _helperDataAccess;

        private static DateTime _balanceUpDay;

        private static DateTime _moveBetsDay;

        #endregion Constants and Fields

        #region Constructors and Destructors

        static ReportHelper()
        {
            _helperDataAccess = new HelperDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Properties

        public static DateTime BalanceUpDay
        {
            get
            {
                object objBalanceUpDay = CacheService.Get(BalanceUpDayKey);

                if (objBalanceUpDay != null)
                {
                    _balanceUpDay = (DateTime)objBalanceUpDay;
                }
                else
                {
                    DataSet dr = _helperDataAccess.GetBalanceUpDay();
                    DataRow r = dr.Tables[0].Rows[0];
                    _balanceUpDay = CastAide.AsDateTime(r[BalanceUpDayKey]);
                    CacheService.Set(BalanceUpDayKey, _balanceUpDay, TimeSpan.FromHours(1));
                }

                return _balanceUpDay;
            }
        }

        public static DateTime MoveBetDay
        {
            get
            {
                object objMoveBetDay = CacheService.Get(MoveBetsDayKey);

                if (objMoveBetDay != null)
                {
                    _moveBetsDay = (DateTime)objMoveBetDay;
                }
                else
                {
                    DataSet dr = _helperDataAccess.GetBalanceUpDay();
                    DataRow r = dr.Tables[0].Rows[0];
                    _moveBetsDay = CastAide.AsDateTime(r[MoveBetsDayKey]);
                    CacheService.Set(MoveBetsDayKey, _moveBetsDay, TimeSpan.FromHours(1));
                }

                return _moveBetsDay;
            }
        }

        #endregion Public Properties
    }
}