// ----------------------------------------------------------------------
// <copyright file="CustomerManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface.Customer
{
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.Customer;
    using Fanex.ABS.Entities.User;

    public interface ICustomerService
    {
        string ABTransactionSync(int puterId, int custid);

        Result AssignAndRemoveAdminOfPunterCode(string adminIdsAssign, string adminIdsRemove, int puntercodeId);

        List<UserSmallInfo> GetAdminByPunterCodeId(int punterCodeId);

        List<PunterMember> GetMemberByPunterCodeId(int punterCodeId);

        List<Punter> GetPunterList();

        string InsertMemberToPunterCode(int userId, string userName, int punterId, string ip);

        string InsertPunterCode(
           int userId, string punterCode, string color, double fbAh, double fbOu, double fb1x2, string ip);

        string RemoveMeberFromPunterCode(int puterId, int userId, string custids, string ip);

        List<UserSuggestion> SearchMemberSuggestion(int currency, string query, bool isNormal);

        MemberManagement SelMemberList(
           string username, int danger, int status, int pageSize, int pageIndex, bool fromCache);

        string UpdatePunterCode(int userId, int punterId, string puntercode,
            string color,
            double fbAh,
            double fbOu,
            double fb1x2,
            bool enabled);
    }
}