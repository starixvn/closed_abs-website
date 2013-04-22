// -----------------------------------------------------------------------
// <copyright file="EMAndFTController.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Report
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Fanex.ABS.Service.Interface.Report;
    using Fanex.ABS.Web.Controllers;
    using Fanex.ABS.Web.Controllers.Filters;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class EMAndFTController : BaseController
    {
        private readonly ISettleResultService _settleResultService;

        public EMAndFTController() : this(null) { }

        public EMAndFTController(ISettleResultService settleResultService)
        {
            _settleResultService = settleResultService ?? new SettleResultService();
        }

        [AuthenticateRead]
        public ActionResult SettleResultPage()
        {
            return View("~/Views/Report/EMAndFT.cshtml");
        }

        #region Post Actions
         
        public JsonResult SettleLeagueByDate(string textDate)
        {
            return Json(_settleResultService.GetLeagueByDate(textDate));
        }

        public JsonResult SettleResult(string textDate, string[] leagues, bool isAll)
        {
            return Json(_settleResultService.SettleResult(textDate, leagues, isAll));
        }

        #endregion Post Actions
    }
}