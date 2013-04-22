namespace Fanex.ABS.Web.Controllers
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;
    using System.Web.Security;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Infrastructure.Configurations;
    using Fanex.ABS.Service.Impl;
    using Fanex.ABS.Service.Interface;
    using Fanex.ABS.Web.Controllers.Helper;

    public class BaseController : Controller
    {
        private readonly ICommonService _commonService;

        public BaseController() : this(null) { }

        public BaseController(ICommonService commonService)
        {
            _commonService = commonService ?? new CommonService();
        }

        #region Methods

        protected ActionResult ForceLogin()
        {
            return new RedirectToRouteResult(
                new RouteValueDictionary(new { controller = "Account", action = "SignIn" }));
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            Downtime downTime = this._commonService.GetDowntimeInfo();

            if (downTime.IsDowntime)
            {
                filterContext.Result =
                    new RedirectToRouteResult(
                        new RouteValueDictionary(
                            new
                                {
                                    controller = "Common",
                                    action = "UnderMaintenance",
                                    from = downTime.From,
                                    to = downTime.To
                                }));
            }
            else
            {
                if (!WebSettings.NotAuthenticateAction.Contains(filterContext.ActionDescriptor.ActionName.ToLower()))
                {
                    if (null == AppSession.PageAccess || null == AppSession.RoleAccess)
                    {
                        System.Web.HttpContext.Current.Session.Clear();
                        var cookie = new HttpCookie(FormsAuthentication.FormsCookieName) { Expires = DateTime.Now.AddDays(-1) };
                        System.Web.HttpContext.Current.Response.Cookies.Add(cookie);
                        FormsAuthentication.SignOut();
                        filterContext.Result = this.ForceLogin();
                    }
                }
            }

            base.OnActionExecuting(filterContext);
        }

        private static void AccessDenied(ActionExecutingContext filterContext)
        {
            filterContext.Result =
                new RedirectToRouteResult(
                    new RouteValueDictionary(new { controller = "Common", action = "AccessDenied" }));
        }

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        } 

        #endregion Methods
    }
}