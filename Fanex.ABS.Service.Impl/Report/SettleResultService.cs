// ----------------------------------------------------------------------
// <copyright file="SettleResultManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Report
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Globalization;
    using System.Linq;
    using DNAide.Core;
    using Fanex.ABS.DataAccess.Impl;
    using Fanex.ABS.Entities.Report;
    using Fanex.ABS.Infrastructure.Cache;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Service.Impl.Helper;
    using Fanex.ABS.Service.Interface.Report;
    using IBCUtils;
    using Nexcel.ABS.DataAccess.Interface;

    public class SettleResultService : ISettleResultService
    {
        #region Constants and Fields

        private readonly ISettleResultDataAccess __settleResultDataAccess;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public SettleResultService()
        {
            this.__settleResultDataAccess = new SettleResultDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        /// <summary>
        /// GetLeagueByDate
        /// </summary>
        /// <param name="textDate"></param>
        /// <returns></returns>
        public List<SettleLeague> GetLeagueByDate(string textDate)
        {
            var leagues = new List<SettleLeague>();
            try
            {
                //get admin id

                DateTime leagueDate = CastAide.AsDateTime(textDate);
                DataSet result = this.__settleResultDataAccess.GetLeagueByDate(leagueDate, 0);
                if (result != null && result.Tables.Count > 0)
                {
                    DataTable tblLeague = result.Tables[0];
                    leagues =
                        tblLeague.Rows.Cast<DataRow>().Select(
                            dr =>
                            new SettleLeague
                                {
                                    League = CastAide.AsInt32(dr["leagueid"], 0),
                                    LeagueName = CacheRef.GetLeagueName(CastAide.AsInt32(dr["leagueid"], 0)),
                                    Sport = CastAide.AsInt32(dr["sporttype"], 0)
                                }).OrderBy(s => s.Sport).ThenBy(
                                    s => s.League).ToList();
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return leagues;
        }

        /// <summary>
        /// SettleResult
        /// </summary>
        /// <param name="textDate"></param>
        /// <param name="leagues"></param>
        /// <param name="sports"></param>
        /// <param name="isAll"></param>
        /// <returns></returns>
        public List<SettleResult> SettleResult(string textDate, string[] leagues, bool isAll)
        {
            var listSports = new List<SettleResult>();

            try
            {
                Dictionary<int, int> leagueSport =
                    leagues.OrderBy(s => CastAide.AsInt32(s.Split('|')[0])).ToDictionary(
                        s => CastAide.AsInt32(s.Split('|')[0]), s => CastAide.AsInt32(s.Split('|')[1]));

                listSports =
                    leagueSport.Values.Distinct().Select(
                        id => new SettleResult { EventDate = textDate, ID = id, Name = CacheRef.GetSportName(id) }).
                        OrderBy(s => s.ID).ToList();

                DateTime leagueDate = CastAide.AsDateTime(textDate);
                int league = true.Equals(isAll) ? 0 : leagueSport.First().Key;
                int sport = true.Equals(isAll) ? 0 : leagueSport.First().Value;
                //get admin id

                DataSet dbResult = this.__settleResultDataAccess.SettleSelectMatch(
                    sport, leagueDate, leagueDate, ReportHelper.MoveBetDay, league, false, false);

                if (dbResult != null && dbResult.Tables.Count > 0)
                {
                    string empty = "&nbsp;";

                    CultureInfo cult = CultureInfo.CurrentCulture;
                    DataTable tblResult = dbResult.Tables[0];

                    listSports.ForEach(
                        sp =>
                        {
                            sp.Leagues =
                                leagueSport.Where(l => l.Value == sp.ID).Select(
                                    l =>
                                    new SettleLeague
                                        {
                                            League = l.Key,
                                            Sport = l.Value,
                                            LeagueName = CacheRef.GetLeagueName(l.Key),
                                            Matches =
                                                tblResult.Select("sporttype=" + sp.ID + " AND leagueid=" + l.Key).
                                                Select(
                                                    dr =>
                                                    new SettleMatch
                                                        {
                                                            ID = CastAide.AsInt32(dr["matchid"], 0),
                                                            Code = dr["matchcode"].ToString(),
                                                            League = l.Key,
                                                            HTeam =
                                                                CacheRef.GetTeamName(dr["homeid"])
                                                                +
                                                                (CastAide.AsBoolean(dr["isNeutral"])
                                                                     ? "(N)"
                                                                     : string.Empty),
                                                            ATeam =
                                                                string.IsNullOrEmpty(CacheRef.GetTeamName(dr["awayid"]))
                                                                    ? empty
                                                                    : CacheRef.GetTeamName(dr["awayid"]),
                                                            KickOffTime =
                                                                string.Format(
                                                                    cult, "{0:MM/dd/yy hh:mm:ss tt}", dr["kickofftime"]),
                                                            Status =
                                                                dr["isPending"].ToString() == "True"
                                                                    ? "Pending"
                                                                    : CastAide.AsString(dr["eventstatus"]),
                                                            Param =
                                                                new SettleParam
                                                                    {
                                                                        Score = __GetScore(dr, sp.ID),
                                                                        Goal = __GetGoal(dr, sp.ID),
                                                                        NumQ = __GetNumQ(dr, sp.ID)
                                                                    }
                                                        }).ToList(),
                                            Horses =
                                                sp.ID != 151
                                                    ? null
                                                    : tblResult.Select("sporttype=151 AND leagueid=" + l.Key).Select(
                                                        dr =>
                                                        new SettleHorse
                                                            {
                                                                RaceNo = dr["homeid"].ToString(),
                                                                RaceName = dr["matchid"].ToString(),
                                                                HorseNo = dr["matchcode"].ToString(),
                                                                Place = "No" + dr["betstatus"].ToString(),
                                                                HorseName = CacheRef.GetHorseTeamName(dr["homeid"]),
                                                                Winodds = this.__GetOdds(dr, "win"),
                                                                Placeodds = this.__GetOdds(dr, "place"),
                                                                Status = dr["eventstatus"].ToString()
                                                            }).ToList()
                                        }).
                                    ToList();
                        });
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return listSports;
        }

        #endregion Public Methods and Operators

        #region Methods

        /// <summary>
        /// __GetGoal
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="sport"></param>
        /// <returns></returns>
        private static SettleGoal __GetGoal(DataRow dr, int sport)
        {
            string empty = "&nbsp;";
            var goal = new SettleGoal { HomeFG = empty, HomeLG = empty, AwayFG = empty, AwayLG = empty, HomeTG = "-", AwayTG = "-" };

            bool _isCalculated = CastAide.AsBoolean(dr["IsCalculated"]);
            bool _isMultiCaled = CastAide.AsBoolean(dr["IsMultiCaled"]);
            bool _isRefund = CastAide.AsBoolean(dr["IsRefund"]);
            bool _isCalRefund = CastAide.AsBoolean(dr["IsCalRefund"]);
            if (!_isCalRefund && !Convert.IsDBNull(dr["betstatus"]) && !string.IsNullOrEmpty(dr["betstatus"].ToString())
                && !"0".Equals(CastAide.AsString(dr["betstatus"])))
            {
                string[] _betStatus;

                // check soccer
                var argsSoccer = new[] { 1 };
                if (argsSoccer.Contains(sport))
                {
                    _betStatus = dr["betstatus"].ToString().Split(':');
                    if (_betStatus.Length >= 2 && _betStatus[1].Split('-').Length == 2)
                    {
                        string _fg = _betStatus[1].Split('-')[0];
                        string _lg = _betStatus[1].Split('-')[1];
                        if (_fg == "1")
                        {
                            goal.HomeFG = "x";
                        }
                        if (_fg == "2")
                        {
                            goal.AwayFG = "x";
                        }
                        if (_lg == "1")
                        {
                            goal.HomeLG = "x";
                        }
                        if (_lg == "2")
                        {
                            goal.AwayLG = "x";
                        }
                    }
                }
                //check Tennis & Badminton
                var argsTmp = new[] { 5, 6, 9, 30 };
                if (argsTmp.Contains(sport))
                {
                    int i = 0, _homeTG = 0, _awayTG = 0;
                    if (dr["betstatus"].ToString().IndexOf(';') > -1)
                    {
                        _betStatus = dr["betstatus"].ToString().Split(';')[1].Split(',');
                    }
                    else
                    {
                        _betStatus = dr["betstatus"].ToString().Split(',');
                    }
                    for (; i < _betStatus.Length; i++)
                    {
                        string[] _info = _betStatus[i].Trim().Split('-');
                        string homeSet = _info.Length >= 1 ? _info[0] : empty;
                        string awaySet = _info.Length >= 2 ? _info[1] : empty;

                        _homeTG += CastAide.AsInt32(homeSet.Trim(), 0);
                        _awayTG += CastAide.AsInt32(awaySet.Trim(), 0);
                    }
                    goal.HomeTG = _homeTG > 0 ? _homeTG.ToString() : "-";
                    goal.AwayTG = _awayTG > 0 ? _awayTG.ToString() : "-";
                }
            }

            // check soccer
            var _argsSoccer = new[] { 1 };
            if (_argsSoccer.Contains(sport))
            {
                // goal history
                string _eventstatus = dr["eventstatus"].ToString();
                string goalRecord = CastAide.AsString(dr["goalrecord"], "");
                goalRecord = (_eventstatus.ToLower().IndexOf(Status.Refund.ToLower()) != -1) ? "" : goalRecord;
                if (!string.IsNullOrEmpty(goalRecord))
                {
                    goal.History = goalRecord;
                }
            }
            return goal;
        }

        /// <summary>
        /// __GetNumQ
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="sport"></param>
        /// <returns></returns>
        private static SettleQ __GetNumQ(DataRow dr, int sport)
        {
            string empty = "-";
            var settleQ = new SettleQ
                {
                    Home1Q = empty,
                    Home2Q = empty,
                    Home3Q = empty,
                    Home4Q = empty,
                    Home5Q = empty,
                    Home6Q = empty,
                    Home7Q = empty,
                    Home8Q = empty,
                    Home9Q = empty,
                    Away1Q = empty,
                    Away2Q = empty,
                    Away3Q = empty,
                    Away4Q = empty,
                    Away5Q = empty,
                    Away6Q = empty,
                    Away7Q = empty,
                    Away8Q = empty,
                    Away9Q = empty,
                    HomeOT = empty,
                    HomeEI = empty,
                    AwayOT = empty,
                    AwayEI = empty
                };
            int totalSets = 0;
            switch (sport)
            {
                case 2: // basketball
                case 3: // football
                case 26: // rugby
                case 32: // netball
                    totalSets = 4;
                    break;

                case 4: //ice hockey
                case 28: // field hockey
                    totalSets = 3;
                    break;

                case 5: // tennis
                case 9: // badminton
                case 6: // volleyball
                case 30: //Squash
                    totalSets = 5;
                    break;

                case 8: // baseball
                    totalSets = 9;
                    break;

                default:
                    break;
            }

            bool _isCalculated = CastAide.AsBoolean(dr["IsCalculated"]);
            bool _isMultiCaled = CastAide.AsBoolean(dr["IsMultiCaled"]);
            bool _isRefund = CastAide.AsBoolean(dr["IsRefund"]);
            bool _isCalRefund = CastAide.AsBoolean(dr["IsCalRefund"]);
            int i = 0;
            if (totalSets > 0 && !_isCalRefund && !Convert.IsDBNull(dr["betstatus"])
                && !string.IsNullOrEmpty(dr["betstatus"].ToString()) && !"0".Equals(CastAide.AsString(dr["betstatus"])))
            {
                string[] _betStatus;

                if (dr["betstatus"].ToString().IndexOf(';') > -1)
                {
                    _betStatus = dr["betstatus"].ToString().Split(';')[1].Split(',');
                }
                else
                {
                    _betStatus = dr["betstatus"].ToString().Split(',');
                }
                for (; i < _betStatus.Length; i++)
                {
                    string[] _info = _betStatus[i].Trim().Split('-');
                    string _cHome = _info.Length >= 1 ? _info[0] : empty;
                    string _cAway = _info.Length >= 2 ? _info[1] : empty;

                    switch (i + 1)
                    {
                        case 1:
                            settleQ.Home1Q = _cHome;
                            settleQ.Away1Q = _cAway;
                            break;
                        case 2:
                            settleQ.Home2Q = _cHome;
                            settleQ.Away2Q = _cAway;
                            break;
                        case 3:
                            settleQ.Home3Q = _cHome;
                            settleQ.Away3Q = _cAway;
                            break;
                        case 4:
                            settleQ.Home4Q = _cHome;
                            settleQ.Away4Q = _cAway;
                            break;
                        case 5:
                            settleQ.Home5Q = _cHome;
                            settleQ.Away5Q = _cAway;
                            break;
                        case 6:
                            settleQ.Home6Q = _cHome;
                            settleQ.Away6Q = _cAway;
                            break;
                        case 7:
                            settleQ.Home7Q = _cHome;
                            settleQ.Away7Q = _cAway;
                            break;
                        case 8:
                            settleQ.Home8Q = _cHome;
                            settleQ.Away8Q = _cAway;
                            break;
                        case 9:
                            settleQ.Home9Q = _cHome;
                            settleQ.Away9Q = _cAway;
                            break;
                        default:
                            break;
                    }
                    if (i == totalSets)
                    {
                        settleQ.HomeOT = _cHome;
                        settleQ.AwayOT = _cAway;

                        // baseball
                        settleQ.HomeEI = _cHome;
                        settleQ.AwayEI = _cAway;
                    }
                }
            }
            return settleQ;
        }

        /// <summary>
        /// __GetScore
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="sport"></param>
        /// <returns></returns>
        private static SettleScore __GetScore(DataRow dr, int sport)
        {
            var score = new SettleScore();
            string eventstatus = dr["eventstatus"].ToString();
            if (eventstatus.IndexOf("Refund HT") > -1)
            {
                score = new SettleScore
                    {
                        HomeHT = "N/A",
                        HomeFT =
                            (!Convert.IsDBNull(dr["finalhomescore"]))
                                ? CastAide.AsInt32(dr["finalhomescore"]).ToString()
                                : "-",
                        AwayHT = "N/A",
                        AwayFT =
                            (!Convert.IsDBNull(dr["finalawayscore"]))
                                ? CastAide.AsInt32(dr["finalawayscore"]).ToString()
                                : "-"
                    };
            }
            else if (eventstatus.IndexOf("Refund") > -1)
            {
                score = new SettleScore { HomeHT = "N/A", HomeFT = "N/A", AwayHT = "N/A", AwayFT = "N/A" };
            }
            else
            {
                score = new SettleScore
                    {
                        HomeHT =
                            (!Convert.IsDBNull(dr["hthomescore"]))
                                ? CastAide.AsInt32(dr["hthomescore"]).ToString()
                                : "-",
                        HomeFT =
                            (!Convert.IsDBNull(dr["finalhomescore"]))
                                ? CastAide.AsInt32(dr["finalhomescore"]).ToString()
                                : "-",
                        AwayHT =
                            (!Convert.IsDBNull(dr["htawayscore"]))
                                ? CastAide.AsInt32(dr["htawayscore"]).ToString()
                                : "-",
                        AwayFT =
                            (!Convert.IsDBNull(dr["finalawayscore"]))
                                ? CastAide.AsInt32(dr["finalawayscore"]).ToString()
                                : "-"
                    };
            }

            score.HomeTS = eventstatus.IndexOf("Refund") >= 0
                               ? "N/A"
                               : (!Convert.IsDBNull(dr["finalhomescore"]))
                                     ? CastAide.AsInt32(dr["finalhomescore"]).ToString()
                                     : "-";
            score.AwayTS = eventstatus.IndexOf("Refund") >= 0
                               ? "N/A"
                               : (!Convert.IsDBNull(dr["finalawayscore"]))
                                     ? CastAide.AsInt32(dr["finalawayscore"]).ToString()
                                     : "-";
            return score;
        }

        /// <summary>
        /// __SettleSelectSport
        /// </summary>
        /// <returns></returns>
        private Dictionary<int, string> SettleSelectSport()
        {
            var sports = new Dictionary<int, string>();

            DataSet dbResult = this.__settleResultDataAccess.GetAllSport();

            if (dbResult != null && dbResult.Tables.Count > 0)
            {
                DataTable tblSport = dbResult.Tables[0];

                sports =
                    tblSport.Rows.Cast<DataRow>().Select(
                        dr =>
                        new KeyValuePair<int, string>(CastAide.AsInt32(dr["sporttype"], -1), dr["sportname"].ToString()))
                        .Where(s => s.Key != 151 && s.Key != -1).ToDictionary(s => s.Key, s => s.Value);
            }

            return sports;
        }

        /// <summary>
        /// __GetOdds
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="inCase"></param>
        /// <returns></returns>
        private string __GetOdds(DataRow dr, string inCase)
        {
            string odds = string.Empty;
            int intPlace = CastAide.AsInt32(dr["betstatus"], 0);
            switch (inCase)
            {
                case "win":
                    odds = (intPlace == 1) ? FormatHandler.FormatNumber20(dr["finalhomescore"]) : "";
                    break;
                case "place":
                    odds = FormatHandler.FormatNumber20(dr["finalawayscore"]);
                    break;
                default:
                    break;
            }
            odds = odds.Equals("0.00") ? string.Empty : odds;
            return odds;
        }

        #endregion Methods
    }

    public static class Status
    {
        #region Constants and Fields

        public static readonly string Completed = "completed";

        public static readonly string LOSE = "LOSE";

        public static readonly string Official = "Official";

        public static readonly string REJECT = "REJECT";

        public static readonly string RUNNING = "running";

        public static readonly string Refund = "Refund";

        public static readonly string RefundFT = "Refund FT";

        public static readonly string VOID = "VOID";

        public static readonly string WAITING = "waiting";

        public static readonly string WIN = "WON";

        #endregion Constants and Fields
    }
}