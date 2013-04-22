using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using DNAide.Core;
using DNAide.Data;
using DNAide.Utils;
using Fanex.ABS.Entities.Report;
using Fanex.ABS.Infrastructure.Cache;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.Data;
using Nexcel.ABS.DataAccess.Interface;

namespace Fanex.ABS.DataAccess.Impl
{
    public class SummaryReportDataAccess : ISummaryReportDataAccess
    {
        public SummaryDTO GetSummary(int adminId, DateTime fromDate, DateTime toDate, string custIds, DateTime moveBetday, int bettype, DateTime balanceUpDay)
        {
            var sumaryDTO = new SummaryDTO();

            var param = new Hashtable();
            param.Add("adminid", adminId);
            param.Add("fromdate", fromDate);
            param.Add("todate", toDate);
            param.Add("punterids", custIds);
            param.Add("movebetsday", moveBetday);
            param.Add("bettype", bettype);
            param.Add("balanceupday", balanceUpDay);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Acc_AB_RptSummary"))
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    //if (dsResult != null && dsResult.Tables.Count > 0)
                    //    tempTable = dsResult.Tables[0];
                    if (dsResult != null && dsResult.Tables.Count <= 0) return sumaryDTO;

                    var tSummary = dsResult.Tables[0];
                    foreach (DataRow row in tSummary.Rows)
                    {
                        if (CastAide.AsInt32(row["punterid"]) == 0)
                        {
                            sumaryDTO.Total = new Summary
                            {
                                Betslip = CastAide.AsDouble(row["betslip"]),
                                Win = CastAide.AsDouble(row["betswin"]),
                                Draw = CastAide.AsDouble(row["betsdraw"]),
                                Lose = CastAide.AsDouble(row["betslose"]),
                                WinPercent = CastAide.AsDouble(row["win_percent"]),
                                TotalStake = CastAide.AsDouble(row["turnover"]),
                                TotalPL = CastAide.AsDouble(row["totalPL"]),
                                MPPercent = CastAide.AsDouble(row["MP"]),
                                IsRunning = CastAide.AsString(row["isRunning"])
                            };
                        }
                        else
                        {
                            sumaryDTO.Summary.Add(BuildRow(row));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return sumaryDTO;
        }

        public SummaryDTO GetSumaryDetailAcc(DateTime fromDate, DateTime toDate, int custId, string acc, DateTime moveBetday, int bettype, DateTime balanceUpDay)
        {
            var sumaryDTO = new SummaryDTO();

            var param = new Hashtable();
            param.Add("fromdate", fromDate);
            param.Add("todate", toDate);
            param.Add("punterid", custId);
            param.Add("movebetsday", moveBetday);
            param.Add("bettype", bettype);
            param.Add("balanceupday", balanceUpDay);
            try
            {
                using (ObjectDb objDB = new ObjectDb("Acc_AB_RptSummary_DetailsByAccount"))
                {
                    objDB.AssignParamValues(param);
                    var dsResult = objDB.ExecuteDataSet();
                    if (dsResult.Tables.Count <= 0) return sumaryDTO;
                    var tSummary = dsResult.Tables[0];

                    foreach (DataRow row in tSummary.Rows)
                    {
                        if (CastAide.AsInt32(row["leagueid"]) == 0)
                        {
                            sumaryDTO.Total = new Summary
                                                  {
                                                      Betslip = CastAide.AsDouble(row["betslip"]),
                                                      Win = CastAide.AsDouble(row["betswin"]),
                                                      Draw = CastAide.AsDouble(row["betsdraw"]),
                                                      Lose = CastAide.AsDouble(row["betslose"]),
                                                      WinPercent = CastAide.AsDouble(row["win_percent"]),
                                                      TotalStake = CastAide.AsDouble(row["turnover"]),
                                                      TotalPL = CastAide.AsDouble(row["totalPL"]),
                                                      MPPercent = CastAide.AsDouble(row["MP"]),
                                                      IsRunning = CastAide.AsString(row["isRunning"])
                                                  };
                        }
                        else
                        {
                            sumaryDTO.Summary.Add(new Summary
                                                      {
                                                          CustID = custId,
                                                          Acc = acc,
                                                          LeagueId = CastAide.AsInt32(row["leagueid"]),
                                                          LeagueName = CacheRef.GetLeagueName(row["leagueid"]),
                                                          Betslip = CastAide.AsDouble(row["betslip"]),
                                                          Win = CastAide.AsDouble(row["betswin"]),
                                                          Draw = CastAide.AsDouble(row["betsdraw"]),
                                                          Lose = CastAide.AsDouble(row["betslose"]),
                                                          WinPercent = CastAide.AsDouble(row["win_percent"]),
                                                          TotalStake = CastAide.AsDouble(row["turnover"]),
                                                          TotalPL = CastAide.AsDouble(row["totalPL"]),
                                                          MPPercent = CastAide.AsDouble(row["MP"]),
                                                          IsRunning = CastAide.AsString(row["isRunning"])
                                                      });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return sumaryDTO;
        }

        private Summary BuildRow(DataRow row)
        {
            return new Summary
            {
                CustID = CastAide.AsInt32(row["punterid"]),
                Acc = CastAide.AsString(row["code"]),
                Betslip = CastAide.AsDouble(row["betslip"]),
                Win = CastAide.AsDouble(row["betswin"]),
                Draw = CastAide.AsDouble(row["betsdraw"]),
                Lose = CastAide.AsDouble(row["betslose"]),
                WinPercent = CastAide.AsDouble(row["win_percent"]),
                TotalStake = CastAide.AsDouble(row["turnover"]),
                TotalPL = CastAide.AsDouble(row["totalPL"]),
                MPPercent = CastAide.AsDouble(row["MP"]),
                Color = CastAide.AsString(row["color"]),
                IsRunning = CastAide.AsString(row["isRunning"])
            };
        }

        private LeagueDetail BuildDetalRow(int index, DataRow row, ref LeagueDetailDTO leagueDetailDTO)
        {
            var BetType = CastAide.AsString(row["bettype"]);
            var BetTeam = CastAide.AsString(row["betteam"]);

            DateTime matchDate = CastAide.AsDateTime(row["kickofftime"]);
            string strMatchDate = matchDate.Month + "/" + matchDate.Day + "/" + matchDate.Year + " "
                    + matchDate.Hour + ":"
                    + (matchDate.Minute.ToString().Length == 1 ? "0" + matchDate.Minute : matchDate.Minute.ToString());

            var ld = new LeagueDetail
            {
                index = index,
                MatchDate = strMatchDate,
                Acc = CastAide.AsString(row["code"]),
                BT = CacheRef.GetBettype(row["bettype"]),
                LeagueName = CacheRef.GetLeagueName(row["leagueid"]),
                HomeName = CacheRef.GetTeamName(row["homeid"]),
                AwayName = CacheRef.GetTeamName(row["awayid"]),
                Betteam = CastAide.AsString(row["betteam"]),
                Odds = CastAide.AsDouble(row["odds"]),
                Stake = CastAide.AsDouble(row["stake"]),
                TotalPL = CastAide.AsDouble(row["totalPL"]),
                Remarks = CastAide.AsString(row["remark"]),
                Score = CastAide.AsString(row["finalhomescore"]) + " - " + CastAide.AsString(row["finalawayscore"]),
                StatusId = CastAide.AsInt32(row["statusid"]),
                Bettype = CastAide.AsInt32(row["bettype"]),
                LiveHomeScore = CastAide.AsInt32(row["livehomescore"]),
                LiveAwayScore = CastAide.AsInt32(row["liveawayscore"]),
                LiveIndicator = CastAide.AsBoolean(row["liveindicator"])
            };
            try
            {
                if (BetType == "1" || BetType == "7")//Handicap
                {
                    if (BetTeam == "h")
                    {
                        ld.HDPGoal = FormatHandler.FormatNumber2(CastAide.AsDecimal(row["hdp2"]) - CastAide.AsDecimal(row["hdp1"]), "en-EN");
                        ld.Hdp = CastAide.AsDecimal(row["hdp2"]) - CastAide.AsDecimal(row["hdp1"]);
                    }
                    else
                    {
                        ld.HDPGoal = FormatHandler.FormatNumber2(CastAide.AsDecimal(row["hdp1"]) - CastAide.AsDecimal(row["hdp2"]), "en-EN");
                        ld.Hdp = CastAide.AsDecimal(row["hdp1"]) - CastAide.AsDecimal(row["hdp2"]);
                    }
                }
                else
                {
                    ld.HDPGoal = FormatHandler.FormatNumber2(Math.Abs(CastAide.AsDecimal(row["hdp1"])), "en-EN");
                    ld.Hdp = Math.Abs(CastAide.AsDecimal(row["hdp1"]));
                }
                leagueDetailDTO.TotalPL += ld.TotalPL;
                leagueDetailDTO.TotalTurnOver += ld.Stake;
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return ld;
        }

        public LeagueDetailDTO GetSumaryDetailLeague(DateTime fromDate, DateTime toDate, string custIds, string leagueIds, DateTime moveBetday, DateTime balanceUpday, int bettype)
        {
            var leagueDetailDTO = new LeagueDetailDTO();
            var param = new Hashtable();

            param.Add("fromdate", fromDate);
            param.Add("todate", toDate);
            param.Add("punterids", custIds);
            param.Add("leagueids", leagueIds);
            param.Add("movebetsday", moveBetday);
            param.Add("balanceupday", balanceUpday);
            param.Add("bettype", bettype);
            var index = 0;
            try
            {
                if (fromDate >= Fanex.ABS.DataAccess.Impl.BalanceUp.BalanceUpDay)
                {
                    using (ObjectDb objDB = new ObjectDb("Acc_AB_RptSummary_DetailsByLeague"))
                    {
                        objDB.AssignParamValues(param);
                        var dsResult = objDB.ExecuteDataSet();
                        if (dsResult.Tables.Count <= 0) return leagueDetailDTO;
                        var tSummary = dsResult.Tables[0];
                        foreach (DataRow row in tSummary.Rows)
                        {
                            ++index;
                            leagueDetailDTO.LeagueDetails.Add(BuildDetalRow(index, row, ref leagueDetailDTO));
                        }
                    }
                }
                else if (toDate < Fanex.ABS.DataAccess.Impl.BalanceUp.BalanceUpDay)
                {
                    using (ObjectDb objDB = new ObjectDb("Acc_AB_RptSummary_DetailsByLeague_Old"))
                    {
                        objDB.AssignParamValues(param);
                        var dsResult = objDB.ExecuteDataSet();
                        if (dsResult.Tables.Count <= 0) return leagueDetailDTO;
                        var tSummary = dsResult.Tables[0];
                        foreach (DataRow row in tSummary.Rows)
                        {
                            ++index;
                            leagueDetailDTO.LeagueDetails.Add(BuildDetalRow(index, row, ref leagueDetailDTO));
                        }
                    }
                }
                else
                {
                    param["fromdate"] = fromDate;
                    param["todate"] = Fanex.ABS.DataAccess.Impl.BalanceUp.BalanceUpDay.AddDays(-1);
                    using (ObjectDb objDB = new ObjectDb("Acc_AB_RptSummary_DetailsByLeague_Old"))
                    {
                        objDB.AssignParamValues(param);
                        var dsResult = objDB.ExecuteDataSet();
                        if (dsResult.Tables.Count > 0)
                        {
                            var tSummaryOld = dsResult.Tables[0];
                            foreach (DataRow row in tSummaryOld.Rows)
                            {
                                ++index;
                                leagueDetailDTO.LeagueDetails.Add(BuildDetalRow(index, row, ref leagueDetailDTO));
                            }
                        }
                    }
                    param["fromdate"] = Fanex.ABS.DataAccess.Impl.BalanceUp.BalanceUpDay;
                    param["todate"] = toDate;
                    using (ObjectDb objDB = new ObjectDb("Acc_AB_RptSummary_DetailsByLeague"))
                    {
                        objDB.AssignParamValues(param);
                        var dsResult = objDB.ExecuteDataSet();
                        if (dsResult.Tables.Count > 0)
                        {
                            var tSummary = dsResult.Tables[0];
                            foreach (DataRow row in tSummary.Rows)
                            {
                                ++index;
                                leagueDetailDTO.LeagueDetails.Add(BuildDetalRow(index, row, ref leagueDetailDTO));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return leagueDetailDTO;
        }
    }
}