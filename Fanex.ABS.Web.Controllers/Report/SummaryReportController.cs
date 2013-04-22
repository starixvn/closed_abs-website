using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ExcelUtil.Spreadsheet;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.ABS.Service.Impl.Report;
using Fanex.ABS.Service.Interface.Report;
using Fanex.ABS.Web.Controllers.Filters;

namespace Fanex.ABS.Web.Controllers.Report
{
    public class SummaryReportController : BaseController
    {
        private readonly ISummaryReportService _summaryReportService;

        public SummaryReportController() : this(null) { }

        public SummaryReportController(ISummaryReportService summaryReportService)
        {
            _summaryReportService = summaryReportService ?? new SummaryReportService();
        }

        [AuthenticateRead]
        public ActionResult SummaryReportPage()
        {
            return View("~/Views/Report/SummaryReport.cshtml");
        }

        #region Post Actions

        public JsonResult GetSummary(string fromDate, string toDate, string custIds, int bettype)
        {
            return Json(_summaryReportService.GetSummary(fromDate, toDate, custIds, bettype));
        }

        public JsonResult GetSumaryDetailAcc(string fromDate, string toDate, int custId, string acc, int bettype)
        {
            return Json(_summaryReportService.GetSumaryDetailAcc(fromDate, toDate, custId, acc, bettype));
        }

        public JsonResult GetSumaryDetailLeague(string fromDate, string toDate, string custIds, string leagueIds, int bettype)
        {
            return Json(_summaryReportService.GetSumaryDetailLeague(fromDate, toDate, custIds, leagueIds, bettype));
        }

        public JsonResult GetDatetimeOption(string dateOption)
        {
            return Json(_summaryReportService.GetDatetimeOption(dateOption));
        }

        public ActionResult ExportExcel(string type, string acc)
        {
            try
            {
                var response = HttpContext.Response;

                var stringFileName = "";

                response.Clear();

                response.Charset = "utf-8";
                response.ContentType = "application/vnd.xls";
                ExcelFile excelFile = new ExcelFile();

                switch (type)
                {
                    case "main":
                        stringFileName = "SummaryReport";
                        excelFile = _summaryReportService.ExportExcelMain(type);
                        break;
                    case "league":
                        stringFileName = "SummaryReportByLeague";
                        excelFile = _summaryReportService.ExportExcelMain(type);
                        break;
                    case "leaguedetail":
                        stringFileName = "SummaryReportLeagueDetail";
                        excelFile = _summaryReportService.ExportExcelLeagueDeatil(DNAide.Core.CastAide.AsString(acc));
                        break;
                }

                if (excelFile != null)
                {
                    excelFile.SaveXls(response.OutputStream);
                }
                response.AddHeader("content-disposition", "attachment;filename=" + stringFileName + ".xls");
                response.End();
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return new EmptyResult();
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
