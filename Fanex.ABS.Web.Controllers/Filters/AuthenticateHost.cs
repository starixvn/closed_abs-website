using System.Web.Mvc;
using System.Web.Routing;
using Fanex.ABS.Service.Impl.User;
using Fanex.ABS.Web.Controllers.Helper;

namespace Fanex.ABS.Web.Controllers.Filters
{
    public class AuthenticateHost : FilterAttribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var actionName = filterContext.ActionDescriptor.ActionName;
            var controlName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;

            var pathActionName = controlName + "/" + actionName;

            bool hasPermissionHost = PermissionService.GetHostPermission(pathActionName, System.Web.HttpContext.Current.Session);

            if (!hasPermissionHost)
            {
                UpdateActionDenied(filterContext);
                return;
            }
        }

        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //throw new NotImplementedException();
        }

        private static void UpdateActionDenied(ActionExecutingContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
            {
                controller = "Common",
                action = "UpdateActionDenied"
            }));
        }
    }
}