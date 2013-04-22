namespace Fanex.ABS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;
    using System.Web.Security;
    using DNAide.Utils;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Infrastructure.Configurations;
    using Fanex.ABS.Infrastructure.Constant;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Service.Impl.User;
    using Fanex.ABS.Web.Controllers.Helper;
    using RSACryptoPad;

    public class AccountController : BaseController
    {
        #region Public Methods and Operators

        [HttpPost]
        public ActionResult SignIn(FormCollection form)
        {
            string errorResult = "signIn.loginError('{0}');";
            // Get UserName and Password from post param
            string username = ViewBag.UserName = form["UserName"].ToString();
            string password = ViewBag.Password = form["Password"].ToString();

            JsonResult jsonResult;
            var result = new Result();
            int custId;
            string system;
            int roleId;

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                result.ErrorMessage = "Username and Password must not be empty!";
                result.ErrorCode = 1;
                ViewBag.ResultMessage = string.Format(errorResult, result.ErrorMessage);
                return View();
            }

            if (LoginFailHandler.IsLocked(username))
            {
                result = LoginFailHandler.WriteJS(username);
                ViewBag.ResultMessage = string.Format(errorResult, IBCUtils.Encryption.RemoveSpecialChars(result.ErrorMessage));
                return View();
            }

            var userAuthenticate = new Authentication();
            string clientIp = Client.GetIp();

            result = userAuthenticate.Login(
                ref username,
                password,
                clientIp,
                Client.GetUri(),
                out custId,
                out roleId,
                out system);

            if (0 == result.ErrorCode)
            {
                LoginFailHandler.LoginSuccess(username);

                FormsAuthentication.SetAuthCookie(username, false);
                AppSession.Username = username;
                AppSession.UserId = custId;
                AppSession.UserNetSessionId = userAuthenticate.GetNetSessionId(
                    custId, WebSettings.ServerId, clientIp, AppSession.UserNetSessionId);
                AppSession.UserRoleId = roleId;

                var userRoleAccess = new Dictionary<string, int>();
                var userPageAccess = new Dictionary<string, int>();

                userAuthenticate.AssignRoles(custId, WebSettings.SystemName, ref userRoleAccess, ref userPageAccess);

                AppSession.RoleAccess = userRoleAccess;
                AppSession.PageAccess = userPageAccess;

                bool hasAbsPermission = PermissionService.HasPermission("abs", AppSession.RoleAccess);

                if (AppSession.RoleAccess == null || AppSession.PageAccess == null || AppSession.RoleAccess.Count == 0
                    || AppSession.PageAccess.Count == 0 || (!WebSettings.SystemName.Equals(system) && !hasAbsPermission))
                {
                    result.ErrorCode = 500;
                    result.ErrorMessage = ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "lblSystemAccessDenied");

                    AppSession.RoleAccess = null;
                    AppSession.PageAccess = null;

                    var cookie = new HttpCookie(FormsAuthentication.FormsCookieName) { Expires = DateTime.Now.AddDays(-1) };
                    System.Web.HttpContext.Current.Response.Cookies.Add(cookie);
                    FormsAuthentication.SignOut();
                    ViewBag.ResultMessage = string.Format(errorResult, IBCUtils.Encryption.RemoveSpecialChars(result.ErrorMessage));
                    return View();
                }

                AppSession.UserMenu = userAuthenticate.GetUserMenu(custId, WebSettings.SystemName);

                return RedirectToAction("Index", "Home");
            }
            else
            {
                if (LoginFailHandler.IsLocked(username))
                {
                    result = LoginFailHandler.WriteJS(username);
                }
                else
                {
                    LoginFailHandler.LoginFailed(username, ErrorCode.USER_EXISTED);

                    if (LoginFailHandler.IsLocked(username))
                    {
                        result = LoginFailHandler.WriteJS(username);
                    }
                    else
                    {
                        result.ErrorMessage = Encryption.RemoveSpecialChars(result.ErrorMessage);
                    }
                }
            }
            ViewBag.ResultMessage = string.Format(errorResult, IBCUtils.Encryption.RemoveSpecialChars(result.ErrorMessage));
            return View();
        }

        [HttpGet]
        public ActionResult SignIn()
        {
            ViewBag.ResultMessage = "";
            ViewBag.UserName = "";
            ViewBag.Password = "";
            return View();
        }

        [HttpGet]
        public ActionResult LogOut()
        {
            try
            {
                int accOnId = 0;
                var context = HttpContext;
                if (AppSession.UserNetSessionId != null)
                {
                    accOnId = (int)AppSession.UserNetSessionId;
                }
                (new Authentication()).AccLogOut(accOnId, AppSession.Username, AppSession.UserRoleId);
                context.Session.Clear();
                FormsAuthentication.SignOut();
                if (context.Request.Cookies != null)
                {
                    var cookie = new HttpCookie(FormsAuthentication.FormsCookieName) { Expires = DateTime.Now.AddDays(-1) };
                    context.Response.Cookies.Add(cookie);
                    FormsAuthentication.SignOut();
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return View();
        }

        [HttpPost]
        public JsonResult UpdateOnlineStatus()
        {
            var result = new Result();

            try
            {
                int onlineId = 0;
                onlineId = AppSession.UserNetSessionId;
                var isOnline = (new Authentication()).OnlineUserUpdate(onlineId);
                if (!isOnline)
                {
                    result.ErrorCode = 1;
                    result.ErrorMessage = "Another session has been logged in or your session is expired. Forced to logout!";
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
                result.ErrorCode = 2;
                result.ErrorMessage = ex.Message;
            }

            return Json(result);
        }

        public ActionResult DirectLogin()
        {
            const int dwKeySize = 1024;
            var param = string.Empty;
            string strParams = string.Empty;
            param = HttpContext.Request["params"];
            var strPath = HttpContext.Request.PhysicalApplicationPath + "/IbcKeys/ibckeydec.snk";
            var encryption = new RSACryptoPad.EncryptionThread();

            param = param.Replace(' ', '+');
            strParams = encryption.DecryptString(param, dwKeySize, strPath);

            string[] ps = strParams.Split('&');
            string username = ps[0].Trim();
            string accId = ps[1];
            string OnAccId = ps[2];
            AppSession.Username = username;

            var userAuthenticate = new Authentication();
            bool isSuccess = userAuthenticate.OnlineUserUpdate(DNAide.Core.CastAide.AsInt32(OnAccId));
            if (!isSuccess)
            {
                return RedirectToAction("LogIn", "Account");
            }
            else
            {
                FormsAuthentication.SetAuthCookie(username, false);
                AppSession.Username = username;

                AppSession.UserId = DNAide.Core.CastAide.AsInt32(accId);

                AppSession.UserNetSessionId = DNAide.Core.CastAide.AsInt32(OnAccId);

                var userRoleAccess = new System.Collections.Generic.Dictionary<string, int>();
                var userPageAccess = new System.Collections.Generic.Dictionary<string, int>();

                userAuthenticate.AssignRoles(DNAide.Core.CastAide.AsInt32(accId), WebSettings.SystemName, ref userRoleAccess, ref  userPageAccess);

                AppSession.RoleAccess = userRoleAccess;
                AppSession.PageAccess = userPageAccess;
                AppSession.UserMenu = userAuthenticate.GetUserMenu(DNAide.Core.CastAide.AsInt32(accId), WebSettings.SystemName);
                return RedirectToAction("Index", "Home");
            }
        }

        #endregion Public Methods and Operators
    }
}