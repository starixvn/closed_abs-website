using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Web;
using DNAide.Core;
using DNAide.Data;
using Fanex.ABS.Entities;
using Fanex.ABS.Entities.Customer;
using Fanex.ABS.Entities.User;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.Data;
using Nexcel.ABS.DataAccess.Interface;

namespace Fanex.ABS.DataAccess.Impl
{
    public class CustomerDataAccess : ICustomerDataAccess
    {
        public DataSet GetMemberList(string username, int danger, int status)
        {
            var param = new Hashtable();
            param.Add("username", username);
            param.Add("danger", danger);
            param.Add("status", status);
            try
            {
                using (ObjectDb objDB = new ObjectDb("CustomerABSel"))
                {
                    objDB.AssignParamValues(param);
                    return objDB.ExecuteDataSet();
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
                return new DataSet();
            }
        }

        public List<Punter> GetPunterList()
        {
            var listPunter = new List<Punter>();
            var param = new Hashtable();
            var dsResult = new DataSet();
            try
            {
                using (ObjectDb objDB = new ObjectDb("CustomerPunterSel"))
                {
                    objDB.AssignParamValues(param);
                    dsResult = objDB.ExecuteDataSet();

                    if (dsResult.Tables.Count <= 0) return listPunter;
                    foreach (DataRow row in dsResult.Tables[0].Rows)
                    {
                        listPunter.Add(new Punter
                                           {
                                               PunterCodeId = CastAide.AsInt32(row["punterid"]),
                                               PunterCode = CastAide.AsString(row["code"]),
                                               ExchangeId = CastAide.AsInt32(row["currency"]),
                                               Color = CastAide.AsString(row["color"]),
                                               TotalMember = CastAide.AsInt32(row["totalMember"]),
                                               UserName = CastAide.AsString(row["username"]),
                                               FBAH = CastAide.AsDouble(row["fb_ah"]),
                                               FBOU = CastAide.AsDouble(row["fb_ou"]),
                                               FB1x2 = CastAide.AsDouble(row["fb_1x2"]),
                                               Enabled = CastAide.AsBoolean(row["enabled"]),
                                               TotalAdmin = CastAide.AsInt32(row["totalAdmin"]),
                                           });
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return listPunter;
        }

        public List<PunterMember> GetMemberByPunterCodeId(int punterCodeId)
        {
            var listPunterMember = new List<PunterMember>();
            var param = new Hashtable();
            param.Add("punterid", punterCodeId);
            try
            {
                var dsResult = new DataSet();
                using (ObjectDb objDB = new ObjectDb("CustomerABSel"))
                {
                    objDB.AssignParamValues(param);
                    dsResult = objDB.ExecuteDataSet();

                    if (dsResult.Tables.Count <= 0) return listPunterMember;
                    foreach (DataRow row in dsResult.Tables[0].Rows)
                    {
                        listPunterMember.Add(new PunterMember
                                                 {
                                                     MemberId = CastAide.AsInt32(row["custid"]),
                                                     MemberName = CastAide.AsString(row["username"])
                                                 });
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return listPunterMember;
        }

        public string InsertPunterCode(int userId, string punterCode, string color, double fbAh, double fbOu, double fb1x2, string ip)
        {
            var param = new Hashtable();
            param.Add("userid", userId);
            param.Add("puntercode", punterCode);
            param.Add("color", color);
            param.Add("fb_ah", fbAh);
            param.Add("fb_ou", fbOu);
            param.Add("fb_1x2", fb1x2);
            param.Add("ip", ip);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Acc_AB_PunterCodeIns"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    return CastAide.AsString(objDB.GetParameterValue("errmsg"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return string.Empty;
        }

        public string UpdatePunterCode(int userId, int punterId, string puntercode, string color, double fbAh, double fbOu, double fb1x2, bool enabled)
        {
            var param = new Hashtable();
            param.Add("userid", userId);
            param.Add("punterid", punterId);
            param.Add("code", puntercode);
            param.Add("color", color);
            param.Add("fb_ah", fbAh);
            param.Add("fb_ou", fbOu);
            param.Add("fb_1x2", fb1x2);
            param.Add("enabled", enabled);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Acc_AB_PunterCodeUpd"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    return CastAide.AsString(objDB.GetParameterValue("errmsg"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return string.Empty;
        }

        public List<UserSuggestion> SearchMemberSuggestion(int currency, string query, bool isNormal)
        {
            var param = new Hashtable();
            param.Add("username", query);
            var listUserInfo = new List<UserSuggestion>();
            try
            {
                var dsResult = new DataSet();
                using (ObjectDb objDB = new ObjectDb("CustomerSelUserSearch"))
                {
                    objDB.AssignParamValues(param);
                    dsResult = objDB.ExecuteDataSet();
                    if (dsResult.Tables.Count <= 0) return listUserInfo;
                    foreach (DataRow row in dsResult.Tables[0].Rows)
                    {
                        listUserInfo.Add(new UserSuggestion
                                             {
                                                 UserName = CastAide.AsString(row["username"])
                                             });
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return listUserInfo;
        }

        public string InsertMemberToPunterCode(int userId, string userName, int punterId, string ip)
        {
            var param = new Hashtable();
            param.Add("userid", userId);
            param.Add("username", userName);
            param.Add("punterid", punterId);
            param.Add("ip", ip);
            try
            {
                using (ObjectDb objDB = new ObjectDb("CustomerABIns"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    return CastAide.AsString(objDB.GetParameterValue("errmsg")) + "|" +
                           CastAide.AsString(objDB.GetParameterValue("custid"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return string.Empty;
        }

        public string RemoveMeberFromPunterCode(int puterId, int userId, string custids, string ip)
        {
            var param = new Hashtable();
            param.Add("userid", userId);
            param.Add("punterid", puterId);
            param.Add("custids", custids);
            param.Add("ip", ip);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Acc_AB_CustomerDel"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    return CastAide.AsString(objDB.GetParameterValue("errmsg"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return string.Empty;
        }

        public string ABTransactionSync(int puterId, int custid)
        {
            var param = new Hashtable();
            param.Add("punterid", puterId);
            param.Add("custid", custid);
            try
            {
                using (ObjectDb objDB = new ObjectDb("ABTransaction_Sync"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    return CastAide.AsString(objDB.GetParameterValue("errmsg"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return string.Empty;
        }

        public List<UserSmallInfo> GetAdminByPunterCodeId(int punterCodeId)
        {
            List<UserSmallInfo> listUser = new List<UserSmallInfo>();
            try
            {
                var param = new Hashtable();
                param.Add("punterid", punterCodeId);
                var dsResult = new DataSet();
                using (ObjectDb objDB = new ObjectDb("Acc_AB_AdminByPunterCodeSel"))
                {
                    objDB.AssignParamValues(param);
                    dsResult = objDB.ExecuteDataSet();
                    if (dsResult.Tables.Count <= 0) return listUser;
                    foreach (DataRow row in dsResult.Tables[0].Rows)
                    {
                        listUser.Add(new UserSmallInfo
                        {
                            UserName = CastAide.AsString(row["username"]),
                            UserId = CastAide.AsInt32(row["adminID"]),
                            IsAssign = CastAide.AsBoolean(row["isChecked"]),
                            IsSupper = CastAide.AsBoolean(row["isSuper"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return listUser;
        }

        public Result AssignAndRemoveAdminOfPunterCode(int custId, string adminIdsAssign, string adminIdsRemove, int puntercodeId)
        {
            var result = new Result();
            var param = new Hashtable();
            param.Add("userid", custId);
            param.Add("adminins", adminIdsAssign);
            param.Add("admindel", adminIdsRemove);
            param.Add("punterid", puntercodeId);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Acc_AB_AdminByPunterCodeUpd"))
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
                result.ErrorCode = 1000;
                result.ErrorMessage = ex.Message;
            }
            return result;
        }
    }
}