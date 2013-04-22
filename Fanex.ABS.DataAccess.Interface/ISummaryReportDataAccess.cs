using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fanex.ABS.Entities.Report;

namespace Nexcel.ABS.DataAccess.Interface
{
    public interface ISummaryReportDataAccess
    {
        SummaryDTO GetSummary(int adminId, DateTime fromDate, DateTime toDate, string custIds, DateTime moveBetday, int bettype, DateTime balanceUpDay);

        SummaryDTO GetSumaryDetailAcc(DateTime fromDate, DateTime toDate, int custId, string acc, DateTime moveBetday, int bettype, DateTime balanceUpDay);

        LeagueDetailDTO GetSumaryDetailLeague(DateTime fromDate, DateTime toDate, string custIds, string leagueIds, DateTime moveBetday, DateTime balanceUpday, int bettype);

    }
}