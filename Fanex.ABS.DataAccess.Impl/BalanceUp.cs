// -----------------------------------------------------------------------
// <copyright file="BalanceUp.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.ABS.DataAccess.Impl
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class BalanceUp
    {
        private static DateTime _balanceUpDay;
        private static DateTime _moveBetsDay;

        static BalanceUp()
        {
            GetBalDay();
        }
        public static DateTime BalanceUpDay
        {
            get { return _balanceUpDay; }
        }

        public static DateTime MoveBetsDay
        {
            get { return _moveBetsDay; }
        }

        private static void GetBalDay()
        {
            using (var objDb = new ObjectDb("SelBalanceUpDay"))
            {
                var dbTemp = objDb.ExecuteDataSet();
                _balanceUpDay = Convert.ToDateTime(dbTemp.Tables[0].Rows[0]["BalanceUpDay"]);
                _moveBetsDay = Convert.ToDateTime(dbTemp.Tables[0].Rows[0]["MoveBetsDay"]);
            }
        }
    }
}
