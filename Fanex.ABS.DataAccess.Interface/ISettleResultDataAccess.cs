using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Nexcel.ABS.DataAccess.Interface
{
    public interface ISettleResultDataAccess
    {
        DataSet GetLeagueByDate(DateTime leagueDate, int sport);

        DataSet SettleSelectMatch(int sporttype, DateTime fromDate, DateTime toDate, DateTime movebetday, int leagueid, bool uncal, bool uncalmul);

        DataSet GetAllSport();
    }
}