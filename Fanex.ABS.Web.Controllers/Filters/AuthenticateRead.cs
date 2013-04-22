namespace Fanex.ABS.Web.Controllers.Filters
{
    using System.Web.Mvc;
    using System.Web.Routing;
    using Fanex.ABS.Service.Impl.User;
    using Fanex.ABS.Web.Controllers.Helper;
    using System.Collections.Generic;

    public class AuthenticateRead : FilterAttribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var actionName = filterContext.ActionDescriptor.ActionName;
            var controlName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;

            var pathActionName = controlName + "/" + actionName;

            bool hasPermissionRead = HasPermissionOnPath(pathActionName, AppSession.PageAccess);

            if (!hasPermissionRead)
            {
                AccessDenied(filterContext);
                return;
            }
        }

        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //throw new NotImplementedException();
        }

        public static bool HasPermissionOnPath(string path, Dictionary<string, int> pageAccess)
        {
            if (pageAccess == null)
            {
                return false;
            }
            return pageAccess.ContainsKey(path.ToLower().Trim());
        }

        private static void AccessDenied(ActionExecutingContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
            {
                controller = "Common",
                action = "AccessDenied"
            }));
        }
    }
}