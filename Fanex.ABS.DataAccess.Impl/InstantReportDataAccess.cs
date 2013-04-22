using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using DNAide.Data;
using DNAide.Utils;
using Fanex.ABS.Entities.Report;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.ABS.Infrastructure.Helper;
using Fanex.Data;
using Nexcel.ABS.DataAccess.Interface;

namespace Fanex.ABS.DataAccess.Impl
{
    public class InstantReportDataAccess : IInstantReportDataAccess
    {
        #region IInstantReportProvider Members

        public DataSet GetLeagueByDate(int adminId, string date, DateTime movebetday)
        {
            var param = new Hashtable { { "adminid", adminId }, { "winlostdate", date }, { "movebetsday", FormatHandler.ResetStartDate(movebetday) } };
            try
            {
                using (ObjectDb objDB = new ObjectDb("LeagueSel"))
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

        public DataSet GetPunterByColor(int adminId, string color)
        {
            var param = new Hashtable { { "adminid", adminId }, { "color", color } };
            try
            {
                using (ObjectDb objDB = new ObjectDb("PunterSel"))
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

        public DataSet GetInstantReportData(int adminId, string kickoffdate, string kickofftime, string leagueids, string punterids, int eventstatus, double mintrans, string matchids, int homeid, int awayid, DateTime eventdate, int bettype, DateTime movebetday)
        {
            var param = new Hashtable {
                { "adminid", adminId },
                { "kickoffdate", kickoffdate },
                { "kickofftime", kickofftime },
                { "leagueids", leagueids },
                { "punterids", punterids },
                { "eventstatus", eventstatus },
                { "matchids", matchids },
                { "homeid", homeid},
                { "awayid", awayid},
                { "eventdate", eventdate},
                { "bettype", bettype},
                { "movebetsday", FormatHandler.ResetStartDate(movebetday)}
            };
            try
            {
                using (ObjectDb objDB = new ObjectDb("InstantReport"))
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

        public DataSet GetInstantReportUpdatedTransData(int adminId, string kickoffdate, string kickofftime, string leagueids, string punterids, double mintrans, string matchids, int bettype, int homeid, int awayid, DateTime eventdate, string mintstamp)
        {
            int discarded;
            byte[] byteArray = Utils.GetBytes(mintstamp, out discarded);

            var param = new Hashtable {
                { "adminid", adminId },
                { "kickoffdate", kickoffdate },
                { "kickofftime", kickofftime },
                { "leagueids", leagueids },
                { "punterids", punterids },
                { "mintrans", mintrans },
                { "bettype", bettype },
                { "matchids", matchids },
                { "homeid", homeid},
                { "awayid", awayid},
                { "eventdate", eventdate},
                { "mintstamp", byteArray }
            };
            try
            {
                using (ObjectDb objDB = new ObjectDb("InstantUpdatedTrans"))
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

        public DataSet GetInstantReportMatchCheckData(int fromid, int toid, string mintstamp)
        {
            var param = new Hashtable {
                { "fromid", fromid },
                { "toid", toid },
                { "mintstamp", mintstamp }
            };
            try
            {
                using (ObjectDb objDB = new ObjectDb("MatchCheck"))
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

        public string UpdateRemark(long transid, string remark)
        {
            var param = new Hashtable {
                { "transid", transid },
                { "remark", remark }
            };
            try
            {
                using (ObjectDb objDB = new ObjectDb("InstantUpdRemark"))
                {
                    objDB.AssignParamValues(param);
                    objDB.ExecuteNonQuery();
                    return DNAide.Core.CastAide.AsString(objDB.GetParameterValue("errmsg"));
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
                return string.Empty;
            }
        }

        public List<MatchOdds> GetEHDAndEOD(string matchIds)
        {
            var listResult = new List<MatchOdds>();
            try
            {
                var param = new Hashtable {
                { "matchid", matchIds }
                };
                var tbResult = new DataSet();
                using (ObjectDb objDB = new ObjectDb("InstantMatchOdds"))
                {
                    objDB.AssignParamValues(param);
                    tbResult = objDB.ExecuteDataSet();
                }

                if (tbResult.Tables.Count <= 0) return listResult;
                foreach (DataRow row in tbResult.Tables[0].Rows)
                {
                    listResult.Add(new MatchOdds
                    {
                        matchid = DNAide.Core.CastAide.AsInt32(row["matchid"]),
                        bettype = DNAide.Core.CastAide.AsInt32(row["bettype"]),
                        eod = DNAide.Core.CastAide.AsDouble(row["eod"]),
                        ehd = DNAide.Core.CastAide.AsDouble(row["ehd"])
                    });
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return listResult;
        }

        #endregion IInstantReportProvider Members
    }
}