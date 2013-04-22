// ----------------------------------------------------------------------
// <copyright file="Authentication.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.User
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Web;
    using DNAide.Core;
    using Fanex.ABS.DataAccess.Impl;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.User;
    using Fanex.ABS.Infrastructure.Constants;
    using Fanex.ABS.Infrastructure.Extensions;
    using Nexcel.ABS.DataAccess.Interface;

    public class Authentication
    {
        #region Constants and Fields

        private readonly IUserDataAccess _userProvider;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public Authentication()
        {
            this._userProvider = new UserDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        public void AccLogOut(int onAccId, string username, int UserRoleId)
        {
            this._userProvider.AccLogOut(onAccId, username, UserRoleId);
        }

        public void AssignRoles(
            int custid,
            string systemName,
            ref Dictionary<string, int> userRoleAccess,
            ref Dictionary<string, int> userRageAccess)
        {
            var pageAccess = new Dictionary<string, int>();
            var roleAccess = new Dictionary<string, int>();
            char[] delimiterChars = { ';' };

            DataTable dtPageAccess = this._userProvider.GetUserPagesAccess(custid);
            if (dtPageAccess != null && dtPageAccess.Rows.Count > 0)
            {
                DataRowCollection drPageAccess = dtPageAccess.Rows;
                foreach (DataRow row in drPageAccess)
                {
                    string filenames = CastAide.AsString(row["filenames"], string.Empty).ToLower();

                    string functionName = CastAide.AsString(row["funcname"], string.Empty).ToLower();

                    if (!functionName.StartsWith("[" + systemName.ToLower()))
                    {
                        continue;
                    }

                    int actualPolicy = CastAide.AsInt32(row["actual_policy"], 0);
                    roleAccess.Add(functionName, actualPolicy);

                    if (string.IsNullOrEmpty(filenames))
                    {
                        continue;
                    }

                    string[] fileList = filenames.Split(delimiterChars, StringSplitOptions.RemoveEmptyEntries);
                    foreach (string file in fileList)
                    {
                        string cleanFilePath = file.Trim();
                        if (!cleanFilePath.IndexOf("?").Equals(-1))
                        {
                            cleanFilePath = file.Substring(0, file.IndexOf('?'));
                            cleanFilePath = cleanFilePath.Trim();
                        }

                        if (!pageAccess.ContainsKey(cleanFilePath))
                        {
                            pageAccess.Add(cleanFilePath, actualPolicy);
                        }
                    }
                }
            }

            userRoleAccess = roleAccess;
            userRageAccess = pageAccess;
        }

        public int GetNetSessionId(int custId, int serverId, string ip, int netSessionId)
        {
            return this._userProvider.GetOnUserId(custId, serverId, ip, netSessionId);
        }

        public List<MenuDetail> GetUserMenu(int custId, string systemName)
        {
            var listMenu = new List<MenuDetail>();

            DataTable dtMenu = this._userProvider.GetUserMenu(custId, systemName);
            HttpContext.Current.Session[SessionKey.SeachMenu] = dtMenu;
            if (dtMenu != null && dtMenu.Rows.Count > 0)
            {
                this.RecursionMenu(dtMenu, ref listMenu, 0);
            }

            return listMenu;
        }

        public void LeaveSSL()
        {
            try
            {
                if (HttpContext.Current.Request.Url.AbsoluteUri.Contains("https"))
                {
                    HttpContext.Current.Response.Redirect(
                        HttpContext.Current.Request.Url.AbsoluteUri.Replace("https", "http"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
        }

        public Result Login(
            ref string username,
            string password,
            string loginIp,
            string fromUrl,
            out int custId,
            out int roleId,
            out string system)
        {
            return this._userProvider.AccLoginAdmin(
                ref username, password, loginIp, fromUrl, out custId, out roleId, out system);
        }

        public bool OnlineUserUpdate(int userId)
        {
            return this._userProvider.OnlineUserUpdate(userId);
        }

        #endregion Public Methods and Operators

        #region Methods

        private void RecursionMenu(DataTable dt, ref List<MenuDetail> listMenu, int parentId)
        {
            if (dt == null || dt.Rows.Count == 0)
            {
                return;
            }

            DataRow[] rows = dt.Select("parentid=" + parentId, "[Order] ASC");
            foreach (DataRow row in rows)
            {
                var menuItem = new MenuDetail
                    {
                        Id = int.Parse(row["MenuId"].ToString()),
                        Name = row["Menu"].ToString(),
                        Url = row["Url"].ToString(),
                        System = row["System"].ToString(),
                        ParentId = CastAide.AsInt32(row["ParentId"]),
                        FunctionName = CastAide.AsString(row["funcname"]),
                        Target = CastAide.AsString(row["Target"]),
                        IsHide = CastAide.AsBoolean(row["IsHide"]),
                        Order = CastAide.AsInt32(row["Order"])
                    };
                var listSubMenu = new List<MenuDetail>();
                this.RecursionMenu(dt, ref listSubMenu, menuItem.Id);
                menuItem.SubMenu = listSubMenu;
                listMenu.Add(menuItem);
            }
        }

        #endregion Methods
    }
}