using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Fanex.ABS.Service.Impl;
using Fanex.ABS.Service.Interface;
using Fanex.ABS.Web.Models;

namespace Fanex.ABS.Web.Controllers
{
    public class CommonController : Controller
    {
        private readonly ICommonService _commonService;

        public CommonController() : this(null) { }

        public CommonController(ICommonService commonService)
        {
            _commonService = commonService ?? new CommonService();
        }

        public ActionResult AccessDenied()
        {
            return View();
        }

        public ActionResult ErrorPage()
        {
            return View();
        }

        public ActionResult UnderMaintenance(string from, string to)
        {
            return View(new UnderMaintenanceModel { From = from, To = to });
        }
    }
}