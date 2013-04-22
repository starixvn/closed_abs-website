using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Fanex.ABS.Infrastructure.Configurations;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.ABS.Infrastructure.Helper;
using Fanex.ABS.Service.Impl.User;
using Fanex.ABS.Service.Interface.User;
using Fanex.ABS.Web.Controllers.Helper;
using Fanex.ABS.Web.Controllers.Filters;

namespace Fanex.ABS.Web.Controllers
{
    public class UserControlController : BaseController
    {
        private readonly IUserService _userService;

        public UserControlController() : this(null) { }

        public UserControlController(IUserService userService)
        {
            _userService = userService ?? new UserService();
        }

        #region Actions

        public ActionResult GroupPolicy()
        {
            ViewBag.DeptName = WebSettings.DeptName;
            ViewBag.SystemName = "[" + WebSettings.SystemName.Trim() + "]";
            ViewBag.ABDGroupID = _userService.GetABDGroupID(ViewBag.DeptName);
            return View();
        }

        [AuthenticateRead]
        public ActionResult ManageUser()
        {
            ViewBag.DeptName = WebSettings.DeptName;
            ViewBag.SystemName = "[" + WebSettings.SystemName.Trim() + "]";
            ViewBag.ABDGroupID = _userService.GetABDGroupID(ViewBag.DeptName);
            ViewBag.ColorFilter = MemberManagementSection.Instance[MemberManagementSection.MemberManagementCollections.Admin]["ColorFilter"].Value;

            ViewBag.strUpdateRoleSuccess = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblUpdateRoleSuccess");
            ViewBag.strPasswordEmpty = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPasswordEmpty");
            ViewBag.strPassswordAtLeast4 = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPassswordAtLeast4");
            ViewBag.strConfirmPassword = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblConfirmPassword");
            ViewBag.strPasswordNotCorrectConfirm = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPasswordNotCorrectConfirm");
            ViewBag.strEnterUsername = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPlsEnterUserName");
            ViewBag.strUpdateStatus = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblUpdateStatusSuccess");
            ViewBag.strUpdateUserInformation = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblUpdateUserInfomation");
            return View();
        }

        [AuthenticateRead]
        public ActionResult ChangePassword()
        {
            ViewBag.strPasswordEmpty = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPasswordEmpty");
            ViewBag.strPassswordAtLeast4 = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPassswordAtLeast4");
            ViewBag.strConfirmPassword = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblConfirmPassword");
            ViewBag.strPasswordNotCorrectConfirm = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblPasswordNotCorrectConfirm");
            return View();
        }

        [AuthenticateRead]
        public ActionResult UserPolicy()
        {
            return View();
        }

        #endregion Actions

        #region Post Actions

        public JsonResult GetABSGroupPolicyList(string deptName)
        {
            return Json(_userService.GetABSGroupPolicyList(deptName));
        }

        public JsonResult UpdateGroupPolicy(string groupPolicies, string oldGroupPolicies, int userID, int groupID)
        {
            return Json(_userService.UpdateGroupPolicy(groupPolicies, oldGroupPolicies, userID, groupID));
        }

        public JsonResult GetAdminsByGroupId(int groupId)
        {
            return Json(_userService.GetAdminsByGroupId(groupId));
        }

        public JsonResult GetUserPolicyList(int userId)
        {
            return Json(_userService.GetUserPolicyList(userId));
        }

        public JsonResult UpdateAdminPolicy(string memberPolicies, string oldMemberPolicies, int userID, int custID)
        {
            return Json(_userService.UpdateAdminPolicy(memberPolicies, oldMemberPolicies, userID, custID));
        }

        public JsonResult UpdatePassword(int CustId, string UserPwd, int UserId)
        {
            return Json(_userService.UpdatePassword(CustId, IBCUtils.Encryption.CfsEnCode(UserPwd), UserId, "E", Utils.GetClientIP()));
        }

        public JsonResult InsertAdmin(string firstname, string lastname, int userid, string username, string password)
        {
            return Json(_userService.InsertAdmin(firstname, lastname, userid, username, password));
        }

        public JsonResult UpdateStatus(int custid, int accid, bool closed)
        {
            return Json(_userService.AccountAdminStatusUpdate(custid, accid, closed));
        }

        public JsonResult UpdateAdminInfo(int custid, int accid, string firstname, int groupid)
        {
            return Json(_userService.AccountAdminInfoUpdate(custid, accid, firstname, groupid));
        }

        public JsonResult UpdatePunterCodes(int adminId, string punterCodeDelete, string punterCodeInsert)
        {
            return Json(_userService.UpdatePunterCodes(adminId, punterCodeDelete, punterCodeInsert));
        }

        public JsonResult SelectPunterCodes(int adminId)
        {
            return Json(_userService.SelectPunterCodes(adminId));
        }

        public JsonResult AssignDefaultPunterCodeToAdmin(int adminId)
        {
            return Json(_userService.AssignDefaultPunterCodeToAdmin(adminId));
        }

        public JsonResult GetSearchMenu(string keyWord)
        {
            return Json(_userService.GetSearchMenu(keyWord));
        }

        #endregion Post Actions
    }
}