// ----------------------------------------------------------------------
// <copyright file="UserController.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface.User
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.Customer;
    using Fanex.ABS.Entities.User;

    public interface IUserService
    {
        Result AccountAdminInfoUpdate(int custid, int accid, string firstName, int groupId);

        Result AccountAdminStatusUpdate(int custid, int accid, bool closed);

        Result AssignDefaultPunterCodeToAdmin(int adminId);

        int GetABDGroupID(string deptName);

        List<UserControlBO> GetABSGroupPolicyList(string deptName);

        List<UserInfo> GetAdminsByGroupId(int groupId);

        List<MenuSmallDetail> GetSearchMenu(string keyWord);

        List<UserControlBO> GetUserPolicyList(int userId);

        DataTable GroupInfoSelect();

        string InsertAdmin(string firstname, string lastname, int userid, string username, string password);

        List<PunterCode> SelectPunterCodes(int adminId);

        string UpdateAdminPolicy(string memberPolicies, string oldMemberPolicies, int userID, int custID);

        string UpdateGroupPolicy(string groupPolicies, string oldGroupPolicies, int userID, int groupID);

        string UpdatePassword(int custId, string userPwd, int userId, string language, string loginIp);

        Result UpdatePunterCodes(int adminId, string punterCodeDelete, string punterCodeInsert);

        int CountNumberAppearText(string data, string keyWord);
    }
}