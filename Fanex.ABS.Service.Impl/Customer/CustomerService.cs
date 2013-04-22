// ----------------------------------------------------------------------
// <copyright file="CustomerManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Customer
{
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using DNAide.Core;
    using Fanex.ABS.DataAccess.Impl;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.Customer;
    using Fanex.ABS.Entities.User;
    using Fanex.ABS.Infrastructure.Constants;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Service.Interface.Customer;
    using Nexcel.ABS.DataAccess.Interface;

    public class CustomerService : ICustomerService
    {
        #region Constants and Fields

        private const string MemberListKey = "ABSMemberList";

        private readonly ICustomerDataAccess _customerDataAccess;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public CustomerService()
        {
            this._customerDataAccess = new CustomerDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        public string ABTransactionSync(int puterId, int custid)
        {
            return this._customerDataAccess.ABTransactionSync(puterId, custid);
        }

        public Result AssignAndRemoveAdminOfPunterCode(string adminIdsAssign, string adminIdsRemove, int puntercodeId)
        {
            int userId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
            return this._customerDataAccess.AssignAndRemoveAdminOfPunterCode(
                userId, adminIdsAssign, adminIdsRemove, puntercodeId);
        }

        public List<UserSmallInfo> GetAdminByPunterCodeId(int punterCodeId)
        {
            return this._customerDataAccess.GetAdminByPunterCodeId(punterCodeId);
        }

        public List<PunterMember> GetMemberByPunterCodeId(int punterCodeId)
        {
            return this._customerDataAccess.GetMemberByPunterCodeId(punterCodeId);
        }

        public List<Punter> GetPunterList()
        {
            return this._customerDataAccess.GetPunterList();
        }

        public string InsertMemberToPunterCode(int userId, string userName, int punterId, string ip)
        {
            return this._customerDataAccess.InsertMemberToPunterCode(userId, userName, punterId, ip);
        }

        public string InsertPunterCode(
            int userId, string punterCode, string color, double fbAh, double fbOu, double fb1x2, string ip)
        {
            return this._customerDataAccess.InsertPunterCode(userId, punterCode, color, fbAh, fbOu, fb1x2, ip);
        }

        public string RemoveMeberFromPunterCode(int puterId, int userId, string custids, string ip)
        {
            return this._customerDataAccess.RemoveMeberFromPunterCode(puterId, userId, custids, ip);
        }

        public List<UserSuggestion> SearchMemberSuggestion(int currency, string query, bool isNormal)
        {
            return this._customerDataAccess.SearchMemberSuggestion(currency, query, isNormal);
        }

        public MemberManagement SelMemberList(
            string username, int danger, int status, int pageSize, int pageIndex, bool fromCache)
        {
            var memberManagerPaging = new MemberManagement { Items = new List<MemberDetail>() };
            MemberManagement memberManager = this.SelMemberListData(username, danger, status, fromCache);

            memberManagerPaging.Items =
                memberManager.Items.Select(c => c).Skip(pageSize * (pageIndex - 1)).Take(pageSize).ToList();
            memberManagerPaging.TotalItem = memberManager.TotalItem;

            return memberManagerPaging;
        }

        public string UpdatePunterCode(
            int userId,
            int punterId,
            string puntercode,
            string color,
            double fbAh,
            double fbOu,
            double fb1x2,
            bool enabled)
        {
            return this._customerDataAccess.UpdatePunterCode(
                userId, punterId, puntercode, color, fbAh, fbOu, fb1x2, enabled);
        }

        #endregion Public Methods and Operators

        #region Methods

        private MemberManagement SelMemberListData(string username, int danger, int status, bool fromCache)
        {
            var memberManager = new MemberManagement();
            memberManager.Items = new List<MemberDetail>();
            object memberSession = SessionExtension.GetSession(HttpContext.Current.Session, MemberListKey);
            if (memberSession == null || !fromCache)
            {
                DataSet dbResult = this._customerDataAccess.GetMemberList(username, danger, status);
                if (dbResult.Tables.Count > 0)
                {
                    DataTable tb = dbResult.Tables[0];
                    memberManager.TotalItem = tb.Rows.Count;
                    for (int i = 0; i < memberManager.TotalItem; i++)
                    {
                        DataRow row = tb.Rows[i];
                        var memberDetail = new MemberDetail
                            {
                                CustId = CastAide.AsInt32(row["custid"]),
                                Username = CastAide.AsString(row["username"]),
                                Level = CastAide.AsString(row["punterlevel"]),
                                Category = CastAide.AsString(row["category"]),
                                Danger = CastAide.AsString(row["danger"]),
                                Color = CastAide.AsString(row["color"]),
                                FBAH = CastAide.AsString(row["fb_ah"]),
                                FBOU = CastAide.AsString(row["fb_ou"]),
                                Enabled = CastAide.AsBoolean(row["enabled"])
                            };
                        memberManager.Items.Add(memberDetail);
                    }

                    SessionExtension.AddSession(HttpContext.Current.Session, MemberListKey, memberManager);
                }
            }
            else
            {
                memberManager = (MemberManagement)memberSession;
            }

            return memberManager;
        }

        #endregion Methods
    }
}