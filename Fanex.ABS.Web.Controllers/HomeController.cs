namespace Fanex.ABS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.ABS.Entities.User;
    using Fanex.ABS.Infrastructure.Configurations;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Web.Controllers.Helper;

    public class HomeController : BaseController
    {
        #region Action functions

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Footer()
        {
            return View();
        }

        private int currentParentId = 0;

        public ActionResult Default()
        {
            WriteMenu(AppSession.UserMenu.Where(item => item.ParentId == 0).Select(s => s).ToList(), 0);
            return View();
        }

        #endregion Action functions

        #region Non action and private functions

        private void WriteMenu(IEnumerable<MenuDetail> parentMenu, int level)
        {
            try
            {
                if (parentMenu == null)
                {
                    return;
                }
                if (parentMenu.Count() <= 0) return;
                string url;
                var parentIndex = 0;

                ViewBag.TopMenu += "<ul" + (level == 0 ? " class=\"sf-menu sf-js-enabled sf-shadow\"" : " style=\"display: none; visibility: hidden;\"") + ">";
                int index = 0;
                foreach (var menu in parentMenu)
                {
                    string parentId = string.Format("pId{0}", parentIndex);
                    url = menu.Url.ToLower().Equals("n/a") ? "javascript:void(0);" : menu.Url;
                    // User this when convert to mvc project
                    if (WebSettings.IsUseMenuMVC)
                    {
                        switch (url)
                        {
                            case "Report/InstantRecords.aspx":
                                url = "../InstantRecords/InstantRecordsPage";
                                break;
                            case "Report/InstantReport.aspx":
                                url = "../InstantReport/InstantReportPage";
                                break;
                            case "Report/Summary/Summary.aspx":
                                url = "../SummaryReport/SummaryReportPage";
                                break;
                            case "Report/EMAndFT.aspx":
                                url = "../EMAndFT/SettleResultPage";
                                break;
                            case "Customer/PunterCodeManagement.aspx":
                                url = "../Customer/PunterCodeManagementPage";
                                break;
                            case "UserControl/GroupPolicy.aspx":
                                url = "../UserControl/GroupPolicy";
                                break;
                            case "UserControl/ManageUser.aspx":
                                url = "../UserControl/ManageUser";
                                break;
                        }
                    }
                    string target = menu.Target == "_blank" ? "_blank" : "centerFr";
                    if (level == 0)
                    {
                        ViewBag.TopMenu += "<li " + (index == 0 ? " class=\"first_item\"" : "") + "><a id=\"" + parentId + "\" href=\"" + url + "\" target=\"" + target + "\"><span><span>" + menu.Name + "</span></span></a>";
                    }
                    else
                    {
                        ViewBag.TopMenu += "<li " + (index == 0 ? " class=\"first_item\"" : "") + "><span><a href=\"" + url + "\" target=\"" + target + "\" >" + menu.Name + "</a></span>";
                    }
                    WriteMenu(menu.SubMenu, level + 1);
                    ViewBag.TopMenu += "</li>";
                    index++;

                    if (level != 0) continue;
                    parentIndex++;
                    currentParentId = parentIndex;
                }
                ViewBag.TopMenu += "</ul>";
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
                ViewBag.TopMenu = string.Empty;
            }
        }

        #endregion Non action and private functions
    }
}