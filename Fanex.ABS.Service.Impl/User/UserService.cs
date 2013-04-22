// ----------------------------------------------------------------------
// <copyright file="UserController.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.User
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using DNAide.Core;
    using DNAide.Utils;
    using Fanex.ABS.DataAccess.Impl;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.Customer;
    using Fanex.ABS.Entities.User;
    using Fanex.ABS.Infrastructure.Configurations;
    using Fanex.ABS.Infrastructure.Constants;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Service.Interface.User;
    using Nexcel.ABS.DataAccess.Interface;

    public class UserService : IUserService
    {
        #region Constants and Fields

        private readonly IUserDataAccess _userDataAccess;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public UserService()
        {
            this._userDataAccess = new UserDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        public Result AccountAdminInfoUpdate(int custid, int accid, string firstName, int groupId)
        {
            var result = new Result();
            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                result.ErrorCode = 500;
                result.ErrorMessage = ResourceExtension.GetResourceValue(
                    ResourceExtension.Resources.ErrorMessage, "_500");
                return result;
            }

            return this._userDataAccess.AccountAdminInfoUpdate(custid, accid, firstName, groupId);
        }

        public Result AccountAdminStatusUpdate(int custid, int accid, bool closed)
        {
            var result = new Result();
            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                result.ErrorCode = 500;
                result.ErrorMessage = ResourceExtension.GetResourceValue(
                    ResourceExtension.Resources.ErrorMessage, "_500");
                return result;
            }

            return this._userDataAccess.AccountAdminStatusUpdate(custid, accid, closed);
        }

        public Result AssignDefaultPunterCodeToAdmin(int adminId)
        {
            var result = new Result();
            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                result.ErrorCode = 500;
                result.ErrorMessage = ResourceExtension.GetResourceValue(
                    ResourceExtension.Resources.ErrorMessage, "_500");
                return result;
            }

            return this._userDataAccess.AssignDefaultPunterCodeToAdmin(adminId);
        }

        public int GetABDGroupID(string deptName)
        {
            DataTable tGroupInfo = this.GroupInfoSelect();
            if (tGroupInfo == null)
            {
                return 0;
            }

            return (from DataRow row in tGroupInfo.Rows where !row.IsNull("groupname") && row["groupname"].ToString().Trim().ToLower().Equals(deptName.Trim().ToLower()) select CastAide.AsInt32(row["groupid"])).FirstOrDefault();
        }

        public List<UserControlBO> GetABSGroupPolicyList(string deptName)
        {
            var listPolicy = new List<UserControlBO>();
            //Get ABD groupid
            DataTable tGroupInfo = this.GroupInfoSelect();
            if (tGroupInfo == null)
            {
                return listPolicy;
            }

            int abdGroupId = (from DataRow row in tGroupInfo.Rows where !row.IsNull("groupname") && row["groupname"].ToString().Trim().ToLower().Equals(deptName.Trim().ToLower()) select CastAide.AsInt32(row["groupid"])).FirstOrDefault();

            DataTable dbResult = this._userDataAccess.SelectGroupPolicy(abdGroupId);
            //if (dbResult != null && dbResult.ResultSet != null && dbResult.ResultSet.Tables.Count > 0)
            this.GroupPolicyListById(dbResult, ref listPolicy, 0);
            return listPolicy;
        }

        public List<UserInfo> GetAdminsByGroupId(int groupId)
        {
            DataTable tUsers = this._userDataAccess.SelectAdminByGroupId(groupId);
            if (tUsers == null)
            {
                return new List<UserInfo>();
            }

            var listUserInfo = new List<UserInfo>();
            foreach (DataRow dr in tUsers.Rows)
            {
                bool isClosed = (!Convert.IsDBNull(dr["closed"])) && (bool)dr["closed"];
                if (isClosed)
                {
                    continue;
                }
                listUserInfo.Add(
                    new UserInfo
                        {
                            UserId = CastAide.AsInt32(dr["custid"]),
                            UserName = CastAide.AsString(dr["username"]),
                            FName = CastAide.AsString(dr["firstname"]),
                            Creator = CastAide.AsString(dr["creator"]),
                            LName = CastAide.AsString(dr["lastname"]),
                            Status = "Active",
                            CreatedDate = CastAide.AsString(dr["createdate"]),
                            GroupName = CastAide.AsString(dr["groupname"]),
                            GroupId = CastAide.AsInt32(dr["groupid"])
                        });
            }

            foreach (DataRow dr in tUsers.Rows)
            {
                bool isClosed = (!Convert.IsDBNull(dr["closed"])) && (bool)dr["closed"];
                if (!isClosed)
                {
                    continue;
                }
                listUserInfo.Add(
                    new UserInfo
                        {
                            UserId = CastAide.AsInt32(dr["custid"]),
                            UserName = CastAide.AsString(dr["username"]),
                            FName = CastAide.AsString(dr["firstname"]),
                            Creator = CastAide.AsString(dr["creator"]),
                            LName = CastAide.AsString(dr["lastname"]),
                            Status = "Closed",
                            CreatedDate = CastAide.AsString(dr["createdate"]),
                            GroupName = CastAide.AsString(dr["groupname"]),
                            GroupId = CastAide.AsInt32(dr["groupid"])
                        });
            }

            return listUserInfo;
        }

        public List<MenuSmallDetail> GetSearchMenu(string keyWord)
        {
            var temp = new List<MenuSmallDetail>();
            var dt = (DataTable)HttpContext.Current.Session[SessionKey.SeachMenu];

            if (dt == null || dt.Rows.Count == 0)
            {
                return temp;
            }

            foreach (DataRow row in dt.Rows)
            {
                //if containt then add
                if (row["Url"].ToString().Contains("aspx") || row["Url"].ToString().Contains("cshtml"))
                {
                    string composeString = row["Menu"] + " " + row["Url"];
                    if (composeString.ToLower().Contains(keyWord.ToLower()) || keyWord == "")
                    {
                        temp.Add(
                            new MenuSmallDetail
                                {
                                    Id = int.Parse(row["MenuId"].ToString()),
                                    Name = row["Menu"].ToString(),
                                    Url = row["Url"].ToString(),
                                    NumOfAppear = this.CountNumberAppearText(composeString, keyWord)
                                });
                    }
                }
            }

            //sort result
            if (keyWord != "" && temp.Count > 1)
            {
                temp.Sort(
                    delegate(MenuSmallDetail menuA, MenuSmallDetail menuB) { return menuB.NumOfAppear.CompareTo(menuA.NumOfAppear); });
            }

            return temp;
        }

        public List<UserControlBO> GetUserPolicyList(int userId)
        {
            DataTable table = this._userDataAccess.GetUserPolicyList(userId);

            var listPolicy = new List<UserControlBO>();
            if (table == null)
            {
                return listPolicy;
            }

            this.UserPolicyListById(table, ref listPolicy, 0);
            return listPolicy;
        }

        public DataTable GroupInfoSelect()
        {
            return this._userDataAccess.GroupInfoSelect();
        }

        public string InsertAdmin(string firstname, string lastname, int userid, string username, string password)
        {
            int groupid = WebSettings.DeptId;
            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                return ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "_500");
            }

            return this._userDataAccess.InsertAdmin(
                groupid, firstname, lastname, userid, username, Encryption.CfsEnCode(password));
        }

        public List<PunterCode> SelectPunterCodes(int adminId)
        {
            var result = new List<PunterCode>();
            DataTable tempTable = this._userDataAccess.SelectPunterCodes(adminId);

            foreach (DataRow row in tempTable.Rows)
            {
                result.Add(
                    new PunterCode
                        {
                            PunterCodeId = CastAide.AsInt32(row["punterid"]),
                            Code = row["code"].ToString(),
                            Color = row["color"].ToString(),
                            IsChecked = (CastAide.AsInt32(row["isChecked"]) == 1)
                        });
            }

            return result;
        }

        public string UpdateAdminPolicy(string memberPolicies, string oldMemberPolicies, int userID, int custID)
        {
            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                return ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "_500");
            }

            return this._userDataAccess.UpdateAdminPolicy(memberPolicies, oldMemberPolicies, userID, custID);
        }

        public string UpdateGroupPolicy(string groupPolicies, string oldGroupPolicies, int userID, int groupID)
        {
            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                return ResourceExtension.GetResourceValue(ResourceExtension.Resources.ErrorMessage, "_500");
            }

            return this._userDataAccess.UpdateGroupPolicy(groupPolicies, oldGroupPolicies, userID, groupID);
        }

        public string UpdatePassword(int custId, string userPwd, int userId, string language, string loginIp)
        {
            return this._userDataAccess.UpdatePassword(custId, userPwd, userId, language, loginIp);
        }

        public Result UpdatePunterCodes(int adminId, string punterCodeDelete, string punterCodeInsert)
        {
            int userId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
            var result = new Result();

            if (!PermissionService.GetHostPermission("ABSAdminUserControl", HttpContext.Current.Session))
            {
                result.ErrorCode = 500;
                result.ErrorMessage = ResourceExtension.GetResourceValue(
                    ResourceExtension.Resources.ErrorMessage, "_500");
                return result;
            }

            return this._userDataAccess.UpdatePunterCodes(userId, adminId, punterCodeDelete, punterCodeInsert);
        }

        public int CountNumberAppearText(string data, string keyWord)
        {
            int tempCount = 0;

            if (keyWord == "")
            {
                return tempCount;
            }

            for (int i = 0; i < data.Length; i++)
            {
                string temString = data.Substring(i);
                if (temString.ToLower().StartsWith(keyWord.ToLower()))
                {
                    tempCount++;
                }
            }

            return tempCount;
        }

        #endregion Public Methods and Operators

        #region Methods

        private void GroupPolicyListById(DataTable dt, ref List<UserControlBO> listPolicy, int parentId)
        {
            if (dt == null || dt.Rows.Count == 0)
            {
                return;
            }

            DataRow[] rows = dt.Select("parentid=" + parentId, "[DisplayOrder] ASC");
            foreach (DataRow row in rows)
            {
                var userControlBo = new UserControlBO
                    {
                        ID = int.Parse(row["FuncId"].ToString()),
                        FuncName = row["FuncName"].ToString(),
                        FuncDesc = row["FuncDesc"].ToString(),
                        ParentId = CastAide.AsInt32(row["parentid"]),
                        TotalSub = CastAide.AsInt32(row["SubFuncCount"]),
                        GroupName = CastAide.AsString(row["groupname"])
                    };
                int policy = CastAide.AsInt32(row["policy"]);
                userControlBo.IsGroupRead = (policy > 0);
                userControlBo.IsGroupHost = (policy == 3);
                var listSubUsercontrol = new List<UserControlBO>();
                this.GroupPolicyListById(dt, ref listSubUsercontrol, userControlBo.ID);
                userControlBo.SubFuncs = listSubUsercontrol;
                listPolicy.Add(userControlBo);
            }
        }

        private void UserPolicyListById(DataTable dt, ref List<UserControlBO> listPolicy, int parentId)
        {
            if (dt == null || dt.Rows.Count == 0)
            {
                return;
            }

            DataRow[] rows = dt.Select("parentid=" + parentId, "[DisplayOrder] ASC");
            foreach (DataRow row in rows)
            {
                var userControlBo = new UserControlBO();
                userControlBo.ID = int.Parse(row["FuncId"].ToString());
                userControlBo.FuncName = row["FuncName"].ToString();
                userControlBo.FuncDesc = row["FuncDesc"].ToString();
                userControlBo.ParentId = CastAide.AsInt32(row["parentid"]);
                userControlBo.TotalSub = CastAide.AsInt32(row["SubFuncCount"]);
                int policy = CastAide.AsInt32(row["policy"]);
                int gpolicy = CastAide.AsInt32(row["gpolicy"]);
                userControlBo.IsRead = (policy > 0);
                userControlBo.IsHost = (policy == 3);
                userControlBo.IsGroupRead = (gpolicy > 0);
                userControlBo.IsGroupHost = (gpolicy == 3);
                var listSubUsercontrol = new List<UserControlBO>();
                this.UserPolicyListById(dt, ref listSubUsercontrol, userControlBo.ID);
                userControlBo.SubFuncs = listSubUsercontrol;
                listPolicy.Add(userControlBo);
            }
        }

        #endregion Methods
    }
}