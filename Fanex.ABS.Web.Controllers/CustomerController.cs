using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Fanex.ABS.Infrastructure.Configurations;
using Fanex.ABS.Infrastructure.Helper;
using Fanex.ABS.Service.Impl.Customer;
using Fanex.ABS.Service.Impl.Helper;
using Fanex.ABS.Service.Impl.User;
using Fanex.ABS.Service.Interface.Customer;
using Fanex.ABS.Service.Interface.User;
using Fanex.ABS.Web.Controllers.Filters;

namespace Fanex.ABS.Web.Controllers
{
    public class CustomerController : BaseController
    {
        private readonly ICustomerService _customerService;
        private readonly IUserService _userService;

        public CustomerController() : this(null, null) { }

        public CustomerController(ICustomerService customerService, IUserService userService)
        {
            _customerService = customerService ?? new CustomerService();
            _userService = userService ?? new UserService();
        }

        [AuthenticateRead]
        public ActionResult MemberManagementPage()
        {
            ViewBag.CategoryConfig = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["Category"].Value;
            ViewBag.ABTDangerConfig = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ABTDanger"].Value;
            ViewBag.ColorFilter = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ColorFilter"].Value;
            return View("~/Views/Customer/MemberManagement.cshtml");
        }
         
        [AuthenticateRead]
        public ActionResult PunterCodeManagementPage()
        {
            ViewBag.ABTDangerConfig = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ABTDanger"].Value;
            ViewBag.ColorFilter = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ColorFilter"].Value;
            ViewBag.DeptName = WebSettings.DeptName;
            ViewBag.ABDGroupID = _userService.GetABDGroupID(ViewBag.DeptName);
            BuildCurrencyArr();
            return View("~/Views/Customer/PunterCodeManagement.cshtml");
        }

        private void BuildCurrencyArr()
        {
            var stbCurrency = new List<string>();
            var listCurrency = (new ExchangeRate()).GetAllCurrency();
            foreach (var currency in listCurrency)
            {
                stbCurrency.Add("{" + "\"ExchangeId\":" + currency.ExchangeId.ToString() + "," + "\"Currency\": \"" + currency.Currency + "\"" + "}");
            }
            ViewBag.CurrencyList = "[" + string.Join(",", stbCurrency.ToArray()) + "]";
        }

        #region Post Actions

        public JsonResult SelMemberList(string username, int danger, int status, int pageSize, int pageIndex, bool fromCache)
        {
            return Json(_customerService.SelMemberList(username, danger, status, pageSize, pageIndex, fromCache));
        }

        public JsonResult GetAllCurrency()
        {
            return Json((new ExchangeRate()).GetAllCurrency());
        }

        public JsonResult GetPunterList()
        {
            return Json(_customerService.GetPunterList());
        }

        public JsonResult GetMemberByPunterCodeId(int punterCodeId)
        {
            return Json(_customerService.GetMemberByPunterCodeId(punterCodeId));
        }

        public JsonResult InsertPunterCode(int userId, string punterCode, string color, double fbAh, double fbOu, double fb1x2)
        {
            return Json(_customerService.InsertPunterCode(userId, punterCode, color, fbAh, fbOu, fb1x2, Utils.GetClientIP()));
        }

        public JsonResult UpdatePunterCode(int userId, int punterId, string puntercode, string color, double fbAh, double fbOu, double fb1x2, bool enabled)
        {
            return Json(_customerService.UpdatePunterCode(userId, punterId, puntercode, color, fbAh, fbOu, fb1x2, enabled));
        }

        public JsonResult SearchMemberSuggestion(int currency, string query, bool isNormal)
        {
            return Json(_customerService.SearchMemberSuggestion(currency, query, isNormal));
        }

        public JsonResult InsertMemberToPunterCode(int userId, string userName, int punterId)
        {
            return Json(_customerService.InsertMemberToPunterCode(userId, userName, punterId, Utils.GetClientIP()));
        }

        public JsonResult RemoveMeberFromPunterCode(int puterId, int userId, string custids)
        {
            return Json(_customerService.RemoveMeberFromPunterCode(puterId, userId, custids, Utils.GetClientIP()));
        }

        public JsonResult ABTransactionSync(int puterId, int custid)
        {
            return Json(_customerService.ABTransactionSync(puterId, custid));
        }

        public JsonResult GetAdminByPunterCodeId(int punterCodeId)
        {
            return Json(_customerService.GetAdminByPunterCodeId(punterCodeId));
        }

        public JsonResult AssignAndRemoveAdminOfPunterCode(string adminIdsAssign, string adminIdsRemove, int puntercodeId)
        {
            return Json(_customerService.AssignAndRemoveAdminOfPunterCode(adminIdsAssign, adminIdsRemove, puntercodeId));
        }

        #endregion Post Actions
    }
}