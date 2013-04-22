// ----------------------------------------------------------------------
// <copyright file="InstantReportManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface.Report
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;

    using Fanex.ABS.Entities.Report;

    public interface IInstantReportService
    {
        InstantReportDetail GetInstantReportData(InstantReportParams reportparams);

        InstantReportDetail GetInstantReportDetailData(InstantReportParams reportparams);

        InstantReportDetail GetInstantReportDetailUpdatedTransData(InstantReportParams reportparams);

        InstantReportDetail GetInstantReportUpdatedTransData(InstantReportParams reportparams);

        List<ABSLeague> GetLeagueByDate(string date);

        List<ABSPunter> GetPunterByColor(string color);

        string UpdateRemark(long transid, string remark);

        List<MatchOdds> GetEHDAndEOD(string matchIds);
    }
}