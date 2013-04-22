namespace Fanex.ABS.Web.Controllers.Filters
{
    using System.Web.Mvc;

    public class LogExceptionFilter : FilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            //LogExtensions.ExceptionHandler(filterContext.Exception);
        }

        private static void UnhandleException(ExceptionContext filterContext)
        {
        }
    }
}