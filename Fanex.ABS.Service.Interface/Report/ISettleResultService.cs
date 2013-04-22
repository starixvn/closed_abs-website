// ----------------------------------------------------------------------
// <copyright file="SettleResultManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface.Report
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Globalization;
    using System.Linq;
    using Fanex.ABS.Entities.Report;

    public interface ISettleResultService
    {
        List<SettleLeague> GetLeagueByDate(string textDate);

        List<SettleResult> SettleResult(string textDate, string[] leagues, bool isAll);
    }
}