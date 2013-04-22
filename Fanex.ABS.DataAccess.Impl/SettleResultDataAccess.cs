using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using DNAide.Data;
using DNAide.Utils;
using Fanex.Data;
using Nexcel.ABS.DataAccess.Interface;

namespace Fanex.ABS.DataAccess.Impl
{
    public class SettleResultDataAccess : ISettleResultDataAccess
    {
        public DataSet GetLeagueByDate(DateTime leagueDate, int sport)
        {
            Hashtable param = new Hashtable();
            param.Add("winlostdate", FormatHandler.ResetStartDate(leagueDate));
            param.Add("movebetsday", Fanex.ABS.DataAccess.Impl.BalanceUp.MoveBetsDay);

            using (ObjectDb objDB = new ObjectDb("SetLeagueSel"))
            {
                objDB.AssignParamValues(param);
                return objDB.ExecuteDataSet();
            }
        }

        public DataSet SettleSelectMatch(int sporttype, DateTime fromDate, DateTime toDate, DateTime movebetday, int leagueid, bool uncal, bool uncalmul)
        {
            Hashtable param = new Hashtable();
            param.Add("winlostdate", FormatHandler.ResetStartDate(fromDate));
            param.Add("movebetday", FormatHandler.ResetStartDate(movebetday));
            param.Add("leagueid", leagueid);
            param.Add("movebetsday", Fanex.ABS.DataAccess.Impl.BalanceUp.MoveBetsDay);
            using (ObjectDb objDB = new ObjectDb("SettleSelectMatch"))
            {
                objDB.AssignParamValues(param);
                return objDB.ExecuteDataSet();
            }
        }

        public DataSet GetAllSport()
        {
            using (ObjectDb objDB = new ObjectDb("SelSports"))
            {
                return objDB.ExecuteDataSet();
            }
        }
    }
}