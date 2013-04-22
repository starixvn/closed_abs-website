using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DNAide.Core;
using Fanex.ABS.Entities.Report;
using Fanex.ABS.Infrastructure.Configurations;
using Fanex.ABS.Service.Impl.Report;
using Fanex.ABS.Service.Interface.Report;
using Fanex.ABS.Web.Controllers.Filters;

namespace Fanex.ABS.Web.Controllers.Report
{
    public class InstantReportController : BaseController
    {
        private readonly IInstantReportService _instantReportService;

        public InstantReportController() : this(null) { }

        public InstantReportController(IInstantReportService instantReportService)
        {
            _instantReportService = instantReportService ?? new InstantReportService();
        }

        [AuthenticateRead]
        public ActionResult InstantReportPage()
        {
            ViewBag.ColorFilter = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ColorFilter"].Value;
            ViewBag.ToDate = DateTime.Now.ToShortDateString();
            return View("~/Views/Report/InstantReport.cshtml");
        }

        [AuthenticateRead]
        public ActionResult InstantReportDetailPage(FormCollection formColection)
        {
            ViewBag.KickOffDate = CastAide.AsDateTime(formColection["KickOffDateInput"]).ToString("MM/dd/yyyy hh:mm:ss");

            var KickOffTime = CastAide.AsString(formColection["KickOffTimeInput"]);
            ViewBag.KickOffTime = (KickOffTime.ToLower() == "all") ? "" : KickOffTime;

            var LeagueIds = CastAide.AsString(formColection["LeagueIdsInput"]);
            ViewBag.LeagueIds = (LeagueIds.ToLower() == "all") ? "" : LeagueIds;

            var PunterIds = CastAide.AsString(formColection["PunterIdsInput"]);
            ViewBag.PunterIds = (PunterIds.ToLower() == "all") ? "" : PunterIds;

            ViewBag.EventStatus = CastAide.AsInt32(formColection["EventStatusInput"]);

            ViewBag.MatchID = CastAide.AsString(formColection["matchIDInput"]);

            ViewBag.MatchCode = CastAide.AsString(formColection["matchCodeInput"]);

            ViewBag.Bettype = CastAide.AsInt32(formColection["bettypeInput"]);

            return View("~/Views/Report/InstantReportDetail.cshtml");
        }

        #region Post Actions

        [HttpPost]
        public JsonResult GetLeagueByDate(string date)
        {
            return Json(_instantReportService.GetLeagueByDate(date));
        }

        [HttpPost]
        public JsonResult GetPunterByColor(string color)
        {
            return Json(_instantReportService.GetPunterByColor(color));
        }


        [HttpPost]
        public JsonResult GetInstantReportData(InstantReportParams reportparams)
        {
            return Json(_instantReportService.GetInstantReportData(reportparams));
        }

        [HttpPost]
        public JsonResult GetInstantReportDetailData(InstantReportParams reportparams)
        {
            return Json(_instantReportService.GetInstantReportDetailData(reportparams));
        }

        [HttpPost]
        public JsonResult GetInstantReportUpdatedTransData(InstantReportParams reportparams)
        {
            return Json(_instantReportService.GetInstantReportUpdatedTransData(reportparams));
        }

        [HttpPost]
        public JsonResult GetInstantReportDetailUpdatedTransData(InstantReportParams reportparams)
        {
            return Json(_instantReportService.GetInstantReportDetailUpdatedTransData(reportparams));
        }

        [HttpPost]
        public JsonResult UpdateRemark(long transid, string remark)
        {
            return Json(_instantReportService.UpdateRemark(transid, remark));
        }

        [HttpPost]
        public JsonResult GetEHDAndEOD(string matchIds)
        {
            return Json(_instantReportService.GetEHDAndEOD(matchIds));
        }

        #endregion Post Actions

        /// <summary>
        /// Override for MaxLength of Json Result
        /// </summary>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <param name="contentEncoding"></param>
        /// <param name="behavior"></param>
        /// <returns></returns>
        //protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        //{
        //    return new JsonResult()
        //    {
        //        Data = data,
        //        ContentType = contentType,
        //        ContentEncoding = contentEncoding,
        //        JsonRequestBehavior = behavior,
        //        MaxJsonLength = Int32.MaxValue
        //    };
        //} 
    }
}