using System.Collections.Generic;
using System.Data;
using Fanex.ABS.Entities;
using Fanex.ABS.Entities.Customer;
using Fanex.ABS.Entities.User;

namespace Nexcel.ABS.DataAccess.Interface
{
    public interface ICustomerDataAccess
    {
        DataSet GetMemberList(string username, int danger, int status);

        List<Punter> GetPunterList();

        List<PunterMember> GetMemberByPunterCodeId(int punterCodeId);

        string InsertPunterCode(int userId, string punterCode, string color, double fbAh, double fbOu, double fb1x2, string ip);

        string UpdatePunterCode(int userId, int punterId, string puntercode, string color, double fbAh, double fbOu, double fb1x2, bool enabled);

        List<UserSuggestion> SearchMemberSuggestion(int currency, string query, bool isNormal);

        string InsertMemberToPunterCode(int userId, string userName, int punterId, string ip);

        string RemoveMeberFromPunterCode(int puterId, int userId, string custids, string ip);

        string ABTransactionSync(int puterId, int custid);

        List<UserSmallInfo> GetAdminByPunterCodeId(int punterCodeId);

        Result AssignAndRemoveAdminOfPunterCode(int custId, string adminIdsAssign, string adminIdsRemove, int puntercodeId);
    }
}