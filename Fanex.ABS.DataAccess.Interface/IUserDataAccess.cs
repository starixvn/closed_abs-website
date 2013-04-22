using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using Fanex.ABS.Entities;

namespace Nexcel.ABS.DataAccess.Interface
{
    public interface IUserDataAccess
    {
        Result AccLoginAdmin(ref string username, string password, string loginIp, string fromUrl,
                                             out int custId, out int roleId, out string system);

        int GetOnUserId(int custId, int serverId, string ip, int netSessionId);

        DataTable GetUserPagesAccess(int userId);

        DataTable GetUserMenu(int custid, string systemName);

        void AccLogOut(int onAccId, string username, int UserRoleId);

        DataTable SelectGroupPolicy(int groupId);

        DataTable GroupInfoSelect();

        string UpdateGroupPolicy(string groupPolicies, string oldGroupPolicies, int userID, int groupID);

        bool OnlineUserUpdate(int onlineUserId);

        DataTable SelectAdminByGroupId(int groupId);

        DataTable GetUserPolicyList(int userId);

        string UpdateAdminPolicy(string memberPolicies, string oldMemberPolicies, int userID, int custID);

        string UpdatePassword(int CustId, string UserPwd, int UserId, string language, string loginIp);

        string InsertAdmin(int groupid, string firstname, string lastname, int userid, string username, string password);

        Result AccountAdminStatusUpdate(int custid, int accid, bool closed);

        Result AccountAdminInfoUpdate(int custid, int accid, string firstName, int groupId);

        Result UpdatePunterCodes(int userId, int adminId, string punterCodeDelete, string punterCodeInsert);

        DataTable SelectPunterCodes(int adminId);

        Result AssignDefaultPunterCodeToAdmin(int adminId);
    }
}