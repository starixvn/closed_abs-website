namespace Fanex.ABS.Web.Controllers.Helper
{
    using System.Web;

    public class Client
    {
        #region Public Methods and Operators

        public static string GetIp()
        {
            if (HttpContext.Current.Request != null)
            {
                return HttpContext.Current.Request.UserHostAddress;
            }
            return "";
        }

        public static string GetUri()
        {
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                return HttpContext.Current.Request.UrlReferrer.AbsoluteUri;
            }
            return "";
        }

        #endregion
    }
}