using System;
using System.Collections.Generic;
using System.Data;
using Fanex.ABS.Entities.Report;

namespace Nexcel.ABS.DataAccess.Interface
{
    public interface IInstantReportDataAccess
    {
        DataSet GetLeagueByDate(int adminId, string date, DateTime movebetday);

        DataSet GetPunterByColor(int adminId, string color);

        DataSet GetInstantReportData(int adminId, string kickoffdate, string kickofftime, string leagueids, string punterids, int eventstatus, double mintrans, string matchids, int homeid, int awayid, DateTime eventdate, int bettype, DateTime movebetday);

        DataSet GetInstantReportUpdatedTransData(int adminId, string kickoffdate, string kickofftime, string leagueids,
                                                  string punterids, double mintrans, string matchids, int bettype,
                                                  int homeid, int awayid, DateTime eventdate, string mintstamp);

        DataSet GetInstantReportMatchCheckData(int fromid, int toid, string mintstamp);

        string UpdateRemark(long transid, string remark);

        List<MatchOdds> GetEHDAndEOD(string matchIds);
    }
}