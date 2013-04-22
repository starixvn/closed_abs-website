using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Fanex.ABS.Entities.Report;
using Fanex.ABS.Infrastructure.Configurations;
using Fanex.ABS.Service.Impl.Report;
using Fanex.ABS.Service.Interface.Report;
using Fanex.ABS.Web.Controllers.Filters;

namespace Fanex.ABS.Web.Controllers.Report
{
    public class InstantRecordsController : BaseController
    {
        private readonly IInstantRecordsService _instantRecordService;
        private readonly IInstantReportService _instantReportService;

        public InstantRecordsController() : this(null, null) { }

        public InstantRecordsController(IInstantRecordsService instantRecordService, IInstantReportService instantReportService)
        {
            _instantRecordService = instantRecordService ?? new InstantRecordsService();
            _instantReportService = instantReportService ?? new InstantReportService();
        }
         
        [AuthenticateRead]
        public ActionResult InstantRecordsPage()
        {
            ViewBag.ColorFilter = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ColorFilter"].Value;
            ViewBag.ToDate = DateTime.Now.ToShortDateString();
            return View("~/Views/Report/InstantRecords.cshtml");
        }

        #region Post Actions

        [HttpPost]
        public JsonResult GetInstantReCordData(InstantReportParams reportparams)
        {
            return Json(_instantRecordService.GetInstantRecordData(reportparams));
        }

        [HttpPost]
        public JsonResult GetInstantReCordUpdatedTransData(InstantReportParams reportparams)
        {
            return Json(_instantRecordService.GetInstantRecordUpdatedTransData(reportparams));
        }

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
        public JsonResult UpdateRemark(long transid, string remark)
        {
            return Json(_instantReportService.UpdateRemark(transid, remark));
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