// ----------------------------------------------------------------------
// <copyright file="SummaryReport.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface.Report
{
    using System;
    using System.Linq;
    using System.Web;
    using ExcelUtil.Spreadsheet;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.Report;

    public interface ISummaryReportService
    {
        ExcelFile ExportExcelLeagueDeatil(string acc);

        ExcelFile ExportExcelMain(string type);

        DateTimeOption GetDatetimeOption(string dateOption);

        SummaryDTO GetSumaryDetailAcc(string fromDate, string toDate, int custId, string acc, int bettype);

        LeagueDetailDTO GetSumaryDetailLeague(string fromDate, string toDate, string custIds, string leagueIds, int bettype);

        SummaryDTO GetSummary(string fromDate, string toDate, string custIds, int bettype);
    }
}