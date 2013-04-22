using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using DNAide.Data;
using DNAide.Utils;
using Fanex.ABS.Entities;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.Data;
using Microsoft.Practices.EnterpriseLibrary.ExceptionHandling;
using Nexcel.ABS.DataAccess.Interface;

namespace Fanex.ABS.DataAccess.Impl
{
    public class UserDataAccess : IUserDataAccess
    {
        private static readonly CultureInfo cult = CultureInfo.CurrentCulture;

        public Result AccLoginAdmin(ref string username, string password, string loginIp, string fromUrl, out int custId, out int roleId, out string system)
        {
            custId = roleId = 0;
            system = "";
            var error = new Result();

            var param = new Hashtable();
            param.Add("username", username);
            param.Add("userpwd", Encryption.CfsEnCode(password));
            param.Add("loginip", loginIp);
            param.Add("from", fromUrl);
            param.Add("custid", 0);
            param.Add("errcode", 0);
            param.Add("errmsg", 0);
            param.Add("roleid", 0);

            using (ObjectDb objDB = new ObjectDb("LoginAdmin"))
            {
                //objDB.AddInParameter("username", DbType.String, username);
                objDB.AssignParamValues(param);
                objDB.ExecuteNonQuery();

                custId = Convert.ToInt32(objDB.GetParameterValue("custid"));
                roleId = Convert.ToInt32(objDB.GetParameterValue("roleid"));
                system = objDB.GetParameterValue("system").ToString();
                int errCode = Convert.ToInt32(objDB.GetParameterValue("errcode"));
                if (errCode != 0)
                {
                    string errmsg = objDB.GetParameterValue("errmsg").ToString();
                    if (errCode == 104)
                    {
                        error.ErrorMessage = errmsg; //Resources.ErrorMsg.ClosedAccount;
                        error.ErrorCode = 104;
                    }
                    else if (errCode == 105)
                    {
                        error.ErrorMessage = errmsg; // Resources.ErrorMsg.DenyLoginAccount;
                        error.ErrorCode = 105;
                    }
                    else
                    {
                        error.ErrorCode = errCode; //IbcError.INVALID_USERNAME_0R_PASSWORD;
                        error.ErrorMessage = errmsg; //IbcError.INVALID_USERNAME_0R_PASSWORD_MSG;
                    }
                }
                else
                {
                    username = objDB.GetParameterValue("username").ToString();
                }
            }

            return error;
        }

        public int GetOnUserId(int custId, int serverId, string ip, int netSessionId)
        {
            int onUserId = 0;

            var param = new Hashtable();
            param.Add("custid", custId);
            param.Add("serverid", serverId);
            param.Add("ip", ip);
            param.Add("on_userid", 0);
            param.Add("subaccid", 3);
            param.Add("netsessionid", netSessionId);

            try
            {
                using (ObjectDb objDB = new ObjectDb("Checkin"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    onUserId = Convert.ToInt32(objDB.GetParameterValue("on_userid"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return onUserId;
        }

        public DataTable GetUserPagesAccess(int userId)
        {
            var param = new Hashtable();
            param.Add("custid", userId);
            var result = new DataTable();
            try
            {
                using (ObjectDb objDB = new ObjectDb("FileNameSelByCustID"))
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        result = dsResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return result;
        }

        public DataTable GetUserMenu(int custid, string currentSystem)
        {
            DataTable dtResult = null;
            var parms = new Hashtable { { "custid", custid }, { "system", currentSystem.ToUpper() } };
            try
            {
                using (ObjectDb objDB = new ObjectDb("UserMenu"))
                {
                    objDB.AssignParamValues(parms);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        dtResult = dsResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return dtResult;
        }

        public void AccLogOut(int onAccId, string username, int UserRoleId)
        {
            var param = new Hashtable();
            param.Add("on_userid", onAccId);
            param.Add("username", username);
            param.Add("roleid", UserRoleId);
            try
            {
                using (ObjectDb objDB = new ObjectDb("UserUpdLogout"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
        }

        public bool OnlineUserUpdate(int onlineUserId)
        {
            bool online = false;
            var param = new Hashtable();
            param.Add("on_userid", onlineUserId);
            param.Add("iskickedout", online);
            try
            {
                using (ObjectDb objDB = new ObjectDb("UserUpd"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    online = !Convert.ToBoolean(objDB.GetParameterValue("iskickedout"), cult);
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return online;
        }

        public DataTable SelectGroupPolicy(int groupId)
        {
            var param = new Hashtable();
            param.Add("groupid", groupId);
            DataTable tempTable = new DataTable();
            try
            {
                using (ObjectDb objDB = new ObjectDb("GroupPolicySel"))
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        tempTable = dsResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return tempTable;
        }

        public DataTable GroupInfoSelect()
        {
            Hashtable param = null;
            DataTable tbResult = new DataTable();
            try
            {
                using (ObjectDb objDB = new ObjectDb("GroupInfoSel"))
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        tbResult = dsResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return tbResult;
        }

        public string UpdateGroupPolicy(string groupPolicies, string oldGroupPolicies, int userID, int groupID)
        {
            var param = new Hashtable();
            param.Add("grouppolicys", groupPolicies);
            param.Add("oldgrouppolicys", oldGroupPolicies);
            param.Add("userid", userID);
            param.Add("groupid", groupID);
            param.Add("language", "E");
            param.Add("isabs", 1);
            param.Add("errcode", 0);
            param.Add("errmsg", string.Empty);
            try
            {
                using (ObjectDb objDB = new ObjectDb("GroupPolicy"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        return objDB.GetParameterValue("errmsg").ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return string.Empty;
        }

        public DataTable SelectAdminByGroupId(int groupId)
        {
            var hash = new Hashtable();
            hash.Add("groupid", groupId);
            DataTable tbResult = null;
            try
            {
                using (ObjectDb objDB = new ObjectDb("AdminSelByGroupID"))
                {
                    objDB.AssignParamValues(hash);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        tbResult = dsResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return tbResult;
        }

        public DataTable GetUserPolicyList(int userId)
        {
            var param = new Hashtable();
            param.Add("custid", userId);
            param.Add("groupid", 0);
            DataTable tbResult = null;
            try
            {
                using (ObjectDb objDB = new ObjectDb("AdminPolicySelByCustID"))
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        tbResult = dsResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return tbResult;
        }

        public string UpdateAdminPolicy(string memberPolicies, string oldMemberPolicies, int userID, int custID)
        {
            var param = new Hashtable();
            param.Add("mempolicys", memberPolicies);
            param.Add("oldmempolicys", oldMemberPolicies);
            param.Add("userid", userID);
            param.Add("custid", custID);
            param.Add("isabs", 1);
            param.Add("language", "E");
            param.Add("errcode", 0);
            param.Add("errmsg", string.Empty);
            try
            {
                using (ObjectDb objDB = new ObjectDb("AdminPolicy"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        return objDB.GetParameterValue("errmsg").ToString();
                    }
                }
            }

            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return string.Empty;
        }

        public string UpdatePassword(int CustId, string UserPwd, int UserId, string language, string loginIp)
        {
            var param = new Hashtable();
            param.Add("custid", CustId);
            param.Add("userpwd", UserPwd);
            param.Add("userid", UserId);
            param.Add("langguage", language);
            param.Add("loginip", loginIp);
            param.Add("isabs", 1);
            try
            {
                using (ObjectDb objDB = new ObjectDb("UpdPwdReset"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        return objDB.GetParameterValue("errmsg").ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return string.Empty;
        }

        public string InsertAdmin(int groupid, string firstname, string lastname, int userid, string username, string password)
        {
            var param = new Hashtable();
            param.Add("groupid", groupid);
            param.Add("firstname", firstname);
            param.Add("lastname", lastname);
            param.Add("userid", userid);
            param.Add("username", username.Trim());
            param.Add("userpwd", password);
            param.Add("custid", 0);
            param.Add("isabs", 1);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Con_AdminIns"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        return objDB.GetParameterValue("errmsg").ToString();
                    }
                    else
                    {
                        return "ok" + objDB.GetParameterValue("custid").ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return string.Empty;
        }

        public Result AccountAdminStatusUpdate(int custid, int accid, bool closed)
        {
            var result = new Result();
            var param = new Hashtable();
            param.Add("custid", custid);
            param.Add("userid", accid);
            param.Add("closed", closed);
            param.Add("language", "E");
            param.Add("errcode", 0);
            param.Add("errmsg", string.Empty);
            param.Add("isabs", 1);
            try
            {
                using (ObjectDb objDB = new ObjectDb("AdminUpdClosed"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        result.ErrorCode = Convert.ToInt32(objDB.GetParameterValue("errcode"));
                        result.ErrorMessage = objDB.GetParameterValue("errmsg").ToString() + "";
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return result;
        }

        public Result AccountAdminInfoUpdate(int custid, int accid, string firstName, int groupId)
        {
            var result = new Result();
            var param = new Hashtable();
            param.Add("custid", custid);
            param.Add("userid", accid);
            param.Add("firstname", firstName);
            param.Add("lastname", "");
            param.Add("groupid", groupId);
            param.Add("isabs", 1);

            try
            {
                using (ObjectDb objDB = new ObjectDb("Con_AdminUpd"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        result.ErrorCode = Convert.ToInt32(objDB.GetParameterValue("errcode"));
                        result.ErrorMessage = objDB.GetParameterValue("errmsg").ToString() + "";
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return result;
        }

        public Result UpdatePunterCodes(int userId, int adminId, string punterCodeDelete, string punterCodeInsert)
        {
            var result = new Result();
            var param = new Hashtable();
            param.Add("userid", userId);
            param.Add("adminid", adminId);
            param.Add("punterdel", punterCodeDelete);
            param.Add("punterins", punterCodeInsert);
            using (ObjectDb objDB = new ObjectDb("Acc_AB_PunterGroupUpd"))
            {
                try
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        result.ErrorCode = Convert.ToInt32(objDB.GetParameterValue("errcode"));
                        result.ErrorMessage = objDB.GetParameterValue("errmsg").ToString() + "";
                    }
                }
                catch (Exception ex)
                {
                    result.ErrorCode = 1000;
                    result.ErrorMessage = ex.Message;
                }
            }
            return result;
        }

        public Result AssignDefaultPunterCodeToAdmin(int adminId)
        {
            var result = new Result();
            var param = new Hashtable();
            param.Add("adminid", adminId);
            using (ObjectDb objDB = new ObjectDb("Acc_AB_PunterCodeAssignAll"))
            {
                try
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    if (Convert.ToInt32(objDB.GetParameterValue("errcode")) > 0)
                    {
                        result.ErrorCode = Convert.ToInt32(objDB.GetParameterValue("errcode"));
                        result.ErrorMessage = objDB.GetParameterValue("errmsg").ToString() + "";
                    }
                }
                catch (Exception ex)
                {
                    result.ErrorCode = 1000;
                    result.ErrorMessage = ex.Message;
                }
            }
            return result;
        }

        public DataTable SelectPunterCodes(int adminId)
        {
            var dtResult = new DataTable();
            var param = new Hashtable();
            param.Add("adminid", adminId);
            using (ObjectDb objDB = new ObjectDb("Acc_AB_PunterGroupSel"))
            {
                try
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult != null && dsResult.Tables.Count > 0)
                        dtResult = dsResult.Tables[0];
                }

                catch (Exception ex)
                {
                    LogExtensions.ExceptionHandler(ex);
                }
            }
            return dtResult;
        }
    }
}