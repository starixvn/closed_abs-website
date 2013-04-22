// ----------------------------------------------------------------------
// <copyright file="InstantReportManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Report
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using DNAide.Core;
    using DNAide.Utils;
    using Fanex.ABS.DataAccess.Impl;
    using Fanex.ABS.Entities.Report;
    using Fanex.ABS.Infrastructure.Cache;
    using Fanex.ABS.Infrastructure.Constants;
    using Fanex.ABS.Infrastructure.Extensions;
    using Fanex.ABS.Infrastructure.Helper;
    using Fanex.ABS.Service.Impl.Helper;
    using Fanex.ABS.Service.Interface.Report;
    using Nexcel.ABS.DataAccess.Interface;

    public class InstantReportService : IInstantReportService
    {
        #region Constants and Fields

        private readonly IInstantReportDataAccess _instantReportDataAccess;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public InstantReportService()
        {
            this._instantReportDataAccess = new InstantReportDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        public List<MatchOdds> GetEHDAndEOD(string matchIds)
        {
            return this._instantReportDataAccess.GetEHDAndEOD(matchIds);
        }

        public InstantReportDetail GetInstantReportData(InstantReportParams reportparams)
        {
            const string Key = SessionKey.LastBetTime;
            const string KeyTrans = SessionKey.LastBetTrans;

            bool isnew = reportparams.MinTrans == 0 ? false : true;

            var instantReport = new InstantReportDetail();

            reportparams.KickOffTime = reportparams.KickOffTime.Equals("all") ? string.Empty : reportparams.KickOffTime;

            instantReport.HoursList = new List<InstantReportDetailByHour>();
            instantReport.PunterList = new List<ABSPunter>();

            try
            {
                int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);

                DataSet dbresult = this._instantReportDataAccess.GetInstantReportData(
                    adminId,
                    reportparams.KickOffDate,
                    reportparams.KickOffTime,
                    reportparams.LeagueIds,
                    reportparams.PunterIds,
                    reportparams.EventStatus,
                    0,
                    reportparams.MatchIds,
                    reportparams.Homeid,
                    reportparams.Awayid,
                    CastAide.AsDateTime(reportparams.EventDate),
                    reportparams.BetType,
                    ReportHelper.MoveBetDay);

                #region get punters

                if (reportparams.MinTrans == 0 && dbresult.Tables.Count > 1)
                {
                    instantReport.PunterList = (from DataRow row in dbresult.Tables[1].Rows
                                                select
                                                    new ABSPunter
                                                        {
                                                            Id = row["punterid"].ToString(),
                                                            PunterCode = row["code"].ToString(),
                                                            Color = row["color"].ToString(),
                                                            fb_ah = FormatHandler.FormatNumber2(row["fb_ah"], "en-EN"),
                                                            fb_ou = FormatHandler.FormatNumber2(row["fb_ou"], "en-EN"),
                                                            fb_1x2 = FormatHandler.FormatNumber2(row["fb_1x2"], "en-EN")
                                                        }).
                        ToList();
                }

                #endregion get punters

                #region mapping trans

                var listTrans = new List<ABTrans>();

                DataRowCollection rows = dbresult.Tables[0].Rows;
                int len = rows.Count;
                if (len > 0)
                {
                    instantReport.MinTrans = CastAide.AsString(rows[0]["transid"]);
                    for (int i = 0; i < len; i++)
                    {
                        DataRow row = rows[i];
                        DateTime dt = CastAide.AsDateTime(row["kickofftime"]);
                        var abTrans = new ABTrans
                            {
                                KickOffTime = dt,
                                HourNo = ("0" + dt.Hour).Substring(("0" + dt.Hour).Length - 2, 2),
                                LeagueId = CastAide.AsString(row["leagueid"]),
                                MatchId = CastAide.AsString(row["matchid"]),
                                MatchCode = CastAide.AsString(row["matchcode"]),
                                MatchCode2 = CastAide.AsString(row["matchcode2"]),
                                HomeId = CastAide.AsString(row["homeid"]),
                                AwayId = CastAide.AsString(row["awayid"]),
                                PunterId = CastAide.AsString(row["punterid"]),
                                PunterName = CastAide.AsString(row["code"]),
                                Color = CastAide.AsString(row["color"]),
                                TransId = CastAide.AsString(row["transid"]),
                                BetType = CastAide.AsString(row["bettype"]),
                                BetTeam = CastAide.AsString(row["betteam"]),
                                Stake = FormatHandler.FormatNumber2(row["stake"], "en-EN"),
                                TStamp = Utils.ToString((byte[])row["tstamp"]),
                                Ehd = CastAide.AsString(CastAide.AsDouble(row["ehd"])),
                                Eod = CastAide.AsString(row["eod"]) == string.Empty ? string.Empty : FormatHandler.FormatNumber3(row["eod"], "en-EN")
                            };
                        instantReport.MaxTrans = CastAide.AsInt64(abTrans.TransId)
                                                 > CastAide.AsInt64(instantReport.MaxTrans)
                                                     ? abTrans.TransId
                                                     : instantReport.MaxTrans;
                        instantReport.MinTrans = CastAide.AsInt64(abTrans.TransId)
                                                 < CastAide.AsInt64(instantReport.MinTrans)
                                                     ? abTrans.TransId
                                                     : instantReport.MinTrans;

                        listTrans.Add(abTrans);
                    }
                }
                
                if (listTrans.Count > 0)
                {
                    instantReport.LastTStamp = listTrans[0].TStamp;
                }
                
                #endregion mapping trans

                #region mapping hour

                List<InstantReportDetailByHour> HoursList =
                    (from string hour in listTrans.Select(s => s.HourNo).Distinct().ToList()
                     select new InstantReportDetailByHour { HourNo = hour }).ToList();
                foreach (InstantReportDetailByHour hour in HoursList)
                {
                    string hourno = hour.HourNo;
                    IEnumerable<ABTrans> listTransByHour = listTrans.Where(s => s.HourNo == hourno);
                    IEnumerable<string> listMatchs = listTransByHour.Select(s => s.MatchCode);
                    IEnumerable<string> listMatchsDistinct = listMatchs.Distinct();
                    //hour.TotalMatchs = listMatchsDistinct.Count();
                    hour.TotalBets = listTransByHour.Count();
                    hour.IsNew = isnew;
                    hour.Matchs = new List<ABMatch>();
                    foreach (string matchcode in listMatchsDistinct)
                    {
                        string matchcode1 = matchcode;

                        List<ABTrans> listTranByHourMatch = listTransByHour.Where(s => s.MatchCode == matchcode1).ToList();

                        #region FT Trans

                        List<ABTrans> listTranByHourMatchFT =
                            listTranByHourMatch.Where(s => s.BetType == "1" || s.BetType == "3" || s.BetType == "5").ToList(
                                );
                        if (listTranByHourMatchFT.Count > 0)
                        {
                            ABTrans firstItem = listTranByHourMatchFT.First();
                            var matchft = new ABMatch
                                {
                                    MatchCode = firstItem.MatchCode,
                                    BetType = "1_3_5",
                                    MatchDT =
                                        ("0" + firstItem.KickOffTime.Hour).Substring(
                                            ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                        +
                                        ("0" + firstItem.KickOffTime.Minute).Substring(
                                            ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                    MatchDate = firstItem.KickOffTime.ToString(),
                                    HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                    AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                    LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                    IsNew = isnew,
                                    Trans = new List<ABTrans>()
                                };
                            matchft.Trans = listTranByHourMatchFT;
                            hour.Matchs.Add(matchft);
                        }

                        #endregion FT Trans

                        #region 1st Trans

                        List<ABTrans> listTranByHourMatch1st =
                            listTranByHourMatch.Where(s => s.BetType == "7" || s.BetType == "8" || s.BetType == "15").ToList
                                ();
                        if (listTranByHourMatch1st.Count > 0)
                        {
                            ABTrans firstItem = listTranByHourMatch1st.First();
                            var match1st = new ABMatch
                                {
                                    MatchCode = firstItem.MatchCode,
                                    BetType = "7_8_15",
                                    MatchDT =
                                        ("0" + firstItem.KickOffTime.Hour).Substring(
                                            ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                        +
                                        ("0" + firstItem.KickOffTime.Minute).Substring(
                                            ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                    MatchDate = firstItem.KickOffTime.ToString(),
                                    HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                    AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                    LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                    IsNew = isnew,
                                    Trans = new List<ABTrans>()
                                };
                            match1st.Trans = listTranByHourMatch1st;
                            hour.Matchs.Add(match1st);
                        }                        
                        #endregion 1st Trans
                    }
                }

                #endregion mapping hour

                #region mapping full hours

                for (int i = 0; i < 24; i++)
                {
                    string _hourno = ("0" + i).Substring(("0" + i).Length - 2, 2);
                    IEnumerable<InstantReportDetailByHour> _hour = HoursList.Where(s => s.HourNo == _hourno);
                    if (_hour.Any())
                    {
                        
                        _hour.First().TotalMatchs = _hour.First().Matchs.Count;
                        instantReport.HoursList.Add(_hour.First());
                    }
                    else
                    {
                        instantReport.HoursList.Add(
                            new InstantReportDetailByHour
                                {
                                    HourNo = _hourno,
                                    TotalBets = 0,
                                    TotalMatchs = 0,
                                    IsNew = false,
                                    Matchs = new List<ABMatch>()
                                });
                    }
                }

                #endregion mapping full hours

                if (instantReport.LastTStamp != null)
                {
                    SessionExtension.AddSession(HttpContext.Current.Session, Key, DateTime.Now);
                    SessionExtension.AddSession(HttpContext.Current.Session, KeyTrans, instantReport.LastTStamp);
                    instantReport.PreviousTStamp = instantReport.LastTStamp;
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return instantReport;
        }

        public InstantReportDetail GetInstantReportDetailData(InstantReportParams reportparams)
        {
            string Key = SessionKey.LastBetTime;
            string KeyTrans = SessionKey.LastBetTrans;

            bool isnew = reportparams.MinTrans == 0 ? false : true;
            reportparams.KickOffTime = reportparams.KickOffTime == "all" ? string.Empty : reportparams.KickOffTime;
            reportparams.LeagueIds = reportparams.LeagueIds == "all" ? string.Empty : reportparams.LeagueIds;
            reportparams.PunterIds = reportparams.PunterIds == "all" ? string.Empty : reportparams.PunterIds;
            var instantReport = new InstantReportDetail { HoursList = new List<InstantReportDetailByHour>(), PunterList = new List<ABSPunter>() };
            var HoursList = new List<InstantReportDetailByHour>();
            //get admin id
            int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
            DataSet dbresult = this._instantReportDataAccess.GetInstantReportData(
                adminId,
                reportparams.KickOffDate,
                reportparams.KickOffTime,
                reportparams.LeagueIds,
                reportparams.PunterIds,
                reportparams.EventStatus,
                0,
                reportparams.MatchIds,
                reportparams.Homeid,
                reportparams.Awayid,
                CastAide.AsDateTime(reportparams.EventDate),
                reportparams.BetType,
                ReportHelper.MoveBetDay);

            #region mapping trans

            var listTrans = new List<ABTrans>();
            DataRowCollection rows = dbresult.Tables[0].Rows;
            int len = rows.Count;
            if (len > 0)
            {
                for (int i = 0; i < len; i++)
                {
                    DataRow row = rows[i];
                    DateTime dt = CastAide.AsDateTime(row["kickofftime"]);
                    DateTime tranDate = CastAide.AsDateTime(row["transdate"]);
                    string strTranDate = string.Empty;
                    if (tranDate != null)
                    {
                        strTranDate = tranDate.Month + "/" + tranDate.Day + "/" + tranDate.Year + " " + tranDate.Hour
                                      + ":"
                                      +
                                      (tranDate.Minute.ToString().Length == 1
                                           ? "0" + tranDate.Minute
                                           : tranDate.Minute.ToString());
                    }

                    var abTrans = new ABTrans
                        {
                            KickOffTime = dt,
                            HourNo = ("0" + dt.Hour).Substring(("0" + dt.Hour).Length - 2, 2),
                            TransDate = strTranDate,
                            LeagueId = CastAide.AsString(row["leagueid"]),
                            MatchId = CastAide.AsString(row["matchid"]),
                            MatchCode = CastAide.AsString(row["matchcode"]),
                            HomeId = CastAide.AsString(row["homeid"]),
                            AwayId = CastAide.AsString(row["awayid"]),
                            FinalHomeScore = CastAide.AsString(row["finalhomescore"]),
                            FinalAwayScore = CastAide.AsString(row["finalawayscore"]),
                            LiveHomeScore = CastAide.AsString(row["livehomescore"]),
                            LiveAwayScore = CastAide.AsString(row["liveawayscore"]),
                            LiveIndicator = CastAide.AsBoolean(row["liveindicator"]),
                            PunterId = CastAide.AsString(row["punterid"]),
                            PunterName = CastAide.AsString(row["code"]),
                            Color = CastAide.AsString(row["color"]),
                            TransId = CastAide.AsString(row["transid"]),
                            BetType = CastAide.AsString(row["bettype"]),
                            BetTypeName = CacheRef.GetBettype(row["bettype"]),
                            BetTeam = CastAide.AsString(row["betteam"]),
                            BetTeamName =
                                this.getTeamName(
                                    CastAide.AsString(row["betteam"]),
                                    CastAide.AsString(row["bettype"]),
                                    row["homeid"],
                                    row["awayid"]),
                            Odds = FormatHandler.FormatNumber3(row["odds"], "en-EN"),
                            FirstOddHDP =
                                row.IsNull("ehd") ? string.Empty : FormatHandler.FormatNumber3(row["ehd"], "en-EN"),
                            FirstOddOU =
                                row.IsNull("eod") ? string.Empty : FormatHandler.FormatNumber3(row["eod"], "en-EN"),
                            Stake = FormatHandler.FormatNumber2(row["stake"], "en-EN"),
                            Winlost = FormatHandler.FormatNumber2(row["winlost"], "en-EN"),
                            StatusId = CastAide.AsInt16(row["statusid"]),
                            Remark = CastAide.AsString(row["remark"]),
                            TStamp = Utils.ToString((byte[])row["tstamp"])
                        };

                    if (abTrans.BetType == "1" || abTrans.BetType == "7") //Handicap
                    {
                        if (abTrans.BetTeam == "h")
                        {
                            abTrans.Hdp =
                                FormatHandler.FormatNumber2(
                                    CastAide.AsDecimal(row["hdp2"]) - CastAide.AsDecimal(row["hdp1"]), "en-EN");
                        }
                        else
                        {
                            abTrans.Hdp =
                                FormatHandler.FormatNumber2(
                                    CastAide.AsDecimal(row["hdp1"]) - CastAide.AsDecimal(row["hdp2"]), "en-EN");
                        }
                    }
                    else if (abTrans.BetType == "3" || abTrans.BetType == "8")
                    {
                        abTrans.Hdp = FormatHandler.FormatNumber2(Math.Abs(CastAide.AsDecimal(row["hdp1"])), "en-EN");
                    }
                    else
                    {
                        abTrans.Hdp = string.Empty;
                    }

                    instantReport.MaxTrans = CastAide.AsInt64(abTrans.TransId)
                                             > CastAide.AsInt64(instantReport.MaxTrans)
                                                 ? abTrans.TransId
                                                 : instantReport.MaxTrans;
                    listTrans.Add(abTrans);
                }
            }

            if (listTrans.Count > 0)
            {
                instantReport.LastTStamp = listTrans[0].TStamp;
            }

            #endregion mapping trans

            #region mapping hour

            HoursList = (from string hour in listTrans.Select(s => s.HourNo).Distinct().ToList()
                         select new InstantReportDetailByHour { HourNo = hour }).ToList();
            foreach (InstantReportDetailByHour hour in HoursList)
            {
                string hourno = hour.HourNo;
                IEnumerable<ABTrans> listTransByHour = listTrans.Where(s => s.HourNo == hourno);
                IEnumerable<string> listMatchs = listTransByHour.Select(s => s.MatchCode);
                IEnumerable<string> listMatchsDistinct = listMatchs.Distinct();
                hour.TotalBets = listTransByHour.Count();
                hour.IsNew = isnew;
                hour.Matchs = new List<ABMatch>();
                foreach (string matchcode in listMatchsDistinct)
                {
                    string matchcode1 = matchcode;

                    List<ABTrans> listTranByHourMatch = listTransByHour.Where(s => s.MatchCode == matchcode1).ToList();

                    #region FT Trans

                    List<ABTrans> listTranByHourMatchFT =
                        listTranByHourMatch.Where(s => s.BetType == "1" || s.BetType == "3" || s.BetType == "5").ToList(
                            );
                    if (listTranByHourMatchFT.Count > 0)
                    {
                        ABTrans firstItem = listTranByHourMatchFT.First();
                        var matchft = new ABMatch
                            {
                                MatchCode = this.ReplaceMatchCode(firstItem.MatchCode),
                                BetType = "1_3_5",
                                MatchDT =
                                    ("0" + firstItem.KickOffTime.Hour).Substring(
                                        ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                    +
                                    ("0" + firstItem.KickOffTime.Minute).Substring(
                                        ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                MatchDate = firstItem.KickOffTime.ToString(),
                                HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                IsNew = isnew,
                                Trans = new List<ABTrans>()
                            };
                        matchft.Trans = listTranByHourMatchFT;
                        hour.Matchs.Add(matchft);
                    }

                    #endregion FT Trans

                    #region 1st Trans

                    List<ABTrans> listTranByHourMatch1st =
                        listTranByHourMatch.Where(s => s.BetType == "7" || s.BetType == "8" || s.BetType == "15").ToList
                            ();
                    if (listTranByHourMatch1st.Count > 0)
                    {
                        ABTrans firstItem = listTranByHourMatch1st.First();
                        var match1st = new ABMatch
                            {
                                MatchCode = this.ReplaceMatchCode(firstItem.MatchCode),
                                BetType = "7_8_15",
                                MatchDT =
                                    ("0" + firstItem.KickOffTime.Hour).Substring(
                                        ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                    +
                                    ("0" + firstItem.KickOffTime.Minute).Substring(
                                        ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                MatchDate = firstItem.KickOffTime.ToString(),
                                HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                IsNew = isnew,
                                Trans = new List<ABTrans>()
                            };
                        match1st.Trans = listTranByHourMatch1st;
                        hour.Matchs.Add(match1st);
                    }

                    #endregion 1st Trans
                }
            }

            #endregion mapping hour

            #region mapping full hours

            for (int i = 0; i < 24; i++)
            {
                string _hourno = ("0" + i).Substring(("0" + i).Length - 2, 2);
                IEnumerable<InstantReportDetailByHour> _hour = HoursList.Where(s => s.HourNo == _hourno);
                if (_hour.Count() > 0)
                {
                    InstantReportDetailByHour fstHour = _hour.First();
                    fstHour.TotalMatchs = fstHour.Matchs.Count;
                    fstHour.Matchs = fstHour.Matchs.OrderBy(x => x.MatchDate).ToList();
                    instantReport.HoursList.Add(fstHour);
                }
                else
                {
                    instantReport.HoursList.Add(
                        new InstantReportDetailByHour
                            {
                                HourNo = _hourno,
                                TotalBets = 0,
                                TotalMatchs = 0,
                                IsNew = false,
                                Matchs = new List<ABMatch>()
                            });
                }
            }

            #endregion mapping full hours

            if (SessionExtension.GetSession(HttpContext.Current.Session, Key) != null)
            {
                var lastBetTime = (DateTime)SessionExtension.GetSession(HttpContext.Current.Session, Key);
                instantReport.PreviousTStamp =
                    CastAide.AsString(SessionExtension.GetSession(HttpContext.Current.Session, KeyTrans));

                if (DateTime.Now > lastBetTime.AddSeconds(5))
                {
                    instantReport.IsOverTime = true;
                }
            }
            //else
            //{
            //    instantReport.IsOverTime = true;

            //}
            return instantReport;
        }

        public InstantReportDetail GetInstantReportDetailUpdatedTransData(InstantReportParams reportparams)
        {
            reportparams.KickOffTime = reportparams.KickOffTime == "all" ? string.Empty : reportparams.KickOffTime;
            reportparams.LeagueIds = reportparams.LeagueIds == "all" ? string.Empty : reportparams.LeagueIds;
            reportparams.PunterIds = reportparams.PunterIds == "all" ? string.Empty : reportparams.PunterIds;
            var instantReport = new InstantReportDetail();
            instantReport.HoursList = new List<InstantReportDetailByHour>();
            instantReport.PunterList = new List<ABSPunter>();
            var HoursList = new List<InstantReportDetailByHour>();
            try
            {
                //get admin id
                int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
                DataSet dbresult = this._instantReportDataAccess.GetInstantReportUpdatedTransData(
                    adminId,
                    reportparams.KickOffDate,
                    reportparams.KickOffTime,
                    reportparams.LeagueIds,
                    reportparams.PunterIds,
                    0,
                    reportparams.MatchIds,
                    reportparams.BetType,
                    reportparams.Homeid,
                    reportparams.Awayid,
                    CastAide.AsDateTime(reportparams.EventDate),
                    reportparams.mintstamp);

                #region mapping trans

                var listTrans = new List<ABTrans>();
                DataRowCollection rows = null;
                int len = 0;
                if (dbresult.Tables.Count > 0)
                {
                    rows = dbresult.Tables[0].Rows;
                    len = rows.Count;
                }
                if (len > 0)
                {
                    instantReport.MinTrans = CastAide.AsString(rows[0]["transid"]);
                    for (int i = 0; i < len; i++)
                    {
                        DataRow row = rows[i];
                        DateTime dt = CastAide.AsDateTime(row["kickofftime"]);
                        DateTime tranDate = CastAide.AsDateTime(row["transdate"]);
                        string strTranDate = string.Empty;

                        strTranDate = tranDate.Month + "/" + tranDate.Day + "/" + tranDate.Year + " " + tranDate.Hour + ":"
                                      +
                                      (tranDate.Minute.ToString().Length == 1
                                           ? "0" + tranDate.Minute
                                           : tranDate.Minute.ToString());

                        var abTrans = new ABTrans
                            {
                                KickOffTime = dt,
                                HourNo = ("0" + dt.Hour).Substring(("0" + dt.Hour).Length - 2, 2),
                                TransDate = strTranDate,
                                LeagueId = CastAide.AsString(row["leagueid"]),
                                MatchId = CastAide.AsString(row["matchid"]),
                                MatchCode = CastAide.AsString(row["matchcode"]),
                                HomeId = CastAide.AsString(row["homeid"]),
                                AwayId = CastAide.AsString(row["awayid"]),
                                FinalHomeScore = CastAide.AsString(row["finalhomescore"]),
                                FinalAwayScore = CastAide.AsString(row["finalawayscore"]),
                                LiveHomeScore = CastAide.AsString(row["livehomescore"]),
                                LiveAwayScore = CastAide.AsString(row["liveawayscore"]),
                                LiveIndicator = CastAide.AsBoolean(row["liveindicator"]),
                                PunterId = CastAide.AsString(row["punterid"]),
                                PunterName = CastAide.AsString(row["code"]),
                                Color = CastAide.AsString(row["color"]),
                                TransId = CastAide.AsString(row["transid"]),
                                BetType = CastAide.AsString(row["bettype"]),
                                BetTypeName = CacheRef.GetBettype(row["bettype"]),
                                BetTeam = CastAide.AsString(row["betteam"]),
                                BetTeamName =
                                    this.getTeamName(
                                        CastAide.AsString(row["betteam"]),
                                        CastAide.AsString(row["bettype"]),
                                        row["homeid"],
                                        row["awayid"]),
                                Odds = FormatHandler.FormatNumber3(row["odds"], "en-EN"),
                                FirstOddHDP =
                                    row.IsNull("ehd") ? string.Empty : FormatHandler.FormatNumber3(row["ehd"], "en-EN"),
                                FirstOddOU =
                                    row.IsNull("eod") ? string.Empty : FormatHandler.FormatNumber3(row["eod"], "en-EN"),
                                Stake = FormatHandler.FormatNumber2(row["stake"], "en-EN"),
                                Winlost = FormatHandler.FormatNumber2(row["winlost"], "en-EN"),
                                StatusId = CastAide.AsInt16(row["statusid"]),
                                Remark = CastAide.AsString(row["remark"]),
                                TStamp = Utils.ToString((byte[])row["tstamp"])
                            };

                        if (abTrans.BetType == "1" || abTrans.BetType == "7") //Handicap
                        {
                            if (abTrans.BetTeam == "h")
                            {
                                abTrans.Hdp =
                                    FormatHandler.FormatNumber2(
                                        CastAide.AsDecimal(row["hdp2"]) - CastAide.AsDecimal(row["hdp1"]), "en-EN");
                            }
                            else
                            {
                                abTrans.Hdp =
                                    FormatHandler.FormatNumber2(
                                        CastAide.AsDecimal(row["hdp1"]) - CastAide.AsDecimal(row["hdp2"]), "en-EN");
                            }
                        }
                        else if (abTrans.BetType == "3" || abTrans.BetType == "8")
                        {
                            abTrans.Hdp = FormatHandler.FormatNumber2(Math.Abs(CastAide.AsDecimal(row["hdp1"])), "en-EN");
                        }
                        else
                        {
                            abTrans.Hdp = string.Empty;
                        }
                        instantReport.MaxTrans = CastAide.AsInt64(abTrans.TransId)
                                                 > CastAide.AsInt64(instantReport.MaxTrans)
                                                     ? abTrans.TransId
                                                     : instantReport.MaxTrans;
                        instantReport.MinTrans = CastAide.AsInt64(abTrans.TransId)
                                                 < CastAide.AsInt64(instantReport.MinTrans)
                                                     ? abTrans.TransId
                                                     : instantReport.MinTrans;
                        listTrans.Add(abTrans);
                    }
                }

                if (listTrans.Count > 0)
                {
                    instantReport.LastTStamp = listTrans[0].TStamp;
                }

                #endregion mapping trans

                HoursList = (from string hour in listTrans.Select(s => s.HourNo).Distinct().ToList()
                             select new InstantReportDetailByHour { HourNo = hour }).ToList();
                foreach (InstantReportDetailByHour hour in HoursList)
                {
                    string hourno = hour.HourNo;
                    IEnumerable<ABTrans> listTransByHour = listTrans.Where(s => s.HourNo == hourno);
                    IEnumerable<string> listMatchs = listTransByHour.Select(s => s.MatchCode);
                    IEnumerable<string> listMatchsDistinct = listMatchs.Distinct();

                    hour.Matchs = new List<ABMatch>();
                    foreach (string matchcode in listMatchsDistinct)
                    {
                        string matchcode1 = matchcode;

                        List<ABTrans> listTranByHourMatch = listTransByHour.Where(s => s.MatchCode == matchcode1).ToList();

                        #region FT Trans

                        List<ABTrans> listTranByHourMatchFT =
                            listTranByHourMatch.Where(s => s.BetType == "1" || s.BetType == "3" || s.BetType == "5").ToList(
                                );
                        if (listTranByHourMatchFT.Count > 0)
                        {
                            ABTrans firstItem = listTranByHourMatchFT.First();
                            var matchft = new ABMatch
                                {
                                    MatchCode = this.ReplaceMatchCode(firstItem.MatchCode),
                                    BetType = "1_3_5",
                                    MatchDT =
                                        ("0" + firstItem.KickOffTime.Hour).Substring(
                                            ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                        +
                                        ("0" + firstItem.KickOffTime.Minute).Substring(
                                            ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                    MatchDate = firstItem.KickOffTime.ToString(),
                                    HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                    AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                    LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                    Trans = new List<ABTrans>()
                                };
                            matchft.Trans = listTranByHourMatchFT;
                            hour.Matchs.Add(matchft);
                        }

                        #endregion FT Trans

                        #region 1st Trans

                        List<ABTrans> listTranByHourMatch1st =
                            listTranByHourMatch.Where(s => s.BetType == "7" || s.BetType == "8" || s.BetType == "15").ToList
                                ();
                        if (listTranByHourMatch1st.Count > 0)
                        {
                            ABTrans firstItem = listTranByHourMatch1st.First();
                            var match1st = new ABMatch
                                {
                                    MatchCode = this.ReplaceMatchCode(firstItem.MatchCode),
                                    BetType = "7_8_15",
                                    MatchDT =
                                        ("0" + firstItem.KickOffTime.Hour).Substring(
                                            ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                        +
                                        ("0" + firstItem.KickOffTime.Minute).Substring(
                                            ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                    MatchDate = firstItem.KickOffTime.ToString(),
                                    HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                    AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                    LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                    Trans = new List<ABTrans>()
                                };
                            match1st.Trans = listTranByHourMatch1st;
                            hour.Matchs.Add(match1st);
                        }

                        #endregion 1st Trans
                    }
                }

                #region mapping full hours

                for (int i = 0; i < 24; i++)
                {
                    string _hourno = ("0" + i).Substring(("0" + i).Length - 2, 2);
                    IEnumerable<InstantReportDetailByHour> _hour = HoursList.Where(s => s.HourNo == _hourno);
                    if (_hour.Count() > 0)
                    {
                        InstantReportDetailByHour fstHour = _hour.First();
                        fstHour.Matchs = fstHour.Matchs.OrderBy(x => x.MatchDate).ToList();
                        instantReport.HoursList.Add(fstHour);
                    }
                    else
                    {
                        instantReport.HoursList.Add(
                            new InstantReportDetailByHour
                                {
                                    HourNo = _hourno,
                                    TotalBets = 0,
                                    TotalMatchs = 0,
                                    IsNew = false,
                                    Matchs = new List<ABMatch>()
                                });
                    }
                }

                #endregion mapping full hours
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }

            return instantReport;
        }

        public InstantReportDetail GetInstantReportUpdatedTransData(InstantReportParams reportparams)
        {
            string Key = SessionKey.LastBetTime;
            string KeyTrans = SessionKey.LastBetTrans;

            reportparams.KickOffTime = reportparams.KickOffTime == "all" ? string.Empty : reportparams.KickOffTime;
            reportparams.LeagueIds = reportparams.LeagueIds == "all" ? string.Empty : reportparams.LeagueIds;
            reportparams.PunterIds = reportparams.PunterIds == "all" ? string.Empty : reportparams.PunterIds;
            var instantReport = new InstantReportDetail();
            instantReport.HoursList = new List<InstantReportDetailByHour>();
            instantReport.PunterList = new List<ABSPunter>();
            instantReport.LeagueList = new List<ABSLeague>();
            try
            {
                //if (SessionExtension.GetSession(HttpContext.Current.Session, KeyMinTrans) != null)
                //{
                //    reportparams.MinTrans = CastAide.AsDouble(SessionExtension.GetSession(HttpContext.Current.Session, KeyMinTrans));
                //}
                //get admin id
                int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
                DataSet dbresult = this._instantReportDataAccess.GetInstantReportUpdatedTransData(
                    adminId,
                    reportparams.KickOffDate,
                    reportparams.KickOffTime,
                    reportparams.LeagueIds,
                    reportparams.PunterIds,
                    0,
                    reportparams.MatchIds,
                    reportparams.BetType,
                    reportparams.Homeid,
                    reportparams.Awayid,
                    CastAide.AsDateTime(reportparams.EventDate),
                    reportparams.mintstamp);

                #region mapping trans

                var listTrans = new List<ABTrans>();
                DataRowCollection rows = null;
                int len = 0;
                if (dbresult.Tables.Count > 0)
                {
                    rows = dbresult.Tables[0].Rows;
                    len = rows.Count;
                }
                if (len > 0)
                {
                    instantReport.MinTrans = CastAide.AsString(rows[0]["transid"]);
                    for (int i = 0; i < len; i++)
                    {
                        DataRow row = rows[i];
                        DateTime dt = CastAide.AsDateTime(row["kickofftime"]);
                        var abTrans = new ABTrans
                            {
                                KickOffTime = dt,
                                HourNo = ("0" + dt.Hour).Substring(("0" + dt.Hour).Length - 2, 2),
                                TransDate = CastAide.AsString(CastAide.AsDateTime(row["transdate"])),
                                LeagueId = CastAide.AsString(row["leagueid"]),
                                MatchId = CastAide.AsString(row["matchid"]),
                                MatchCode = CastAide.AsString(row["matchcode"]),
                                MatchCode2 = CastAide.AsString(row["matchcode2"]),
                                HomeId = CastAide.AsString(row["homeid"]),
                                AwayId = CastAide.AsString(row["awayid"]),
                                PunterId = CastAide.AsString(row["punterid"]),
                                PunterName = CastAide.AsString(row["code"]),
                                Color = CastAide.AsString(row["color"]),
                                TransId = CastAide.AsString(row["transid"]),
                                BetType = CastAide.AsString(row["bettype"]),
                                BetTeam = CastAide.AsString(row["betteam"]),
                                Odds = FormatHandler.FormatNumber3(row["odds"], "en-EN"),
                                Stake = FormatHandler.FormatNumber2(row["stake"], "en-EN"),
                                StatusId = CastAide.AsInt16(row["statusid"]),
                                TStamp = Utils.ToString((byte[])row["tstamp"]),
                                Ehd = CastAide.AsString(CastAide.AsDouble(row["ehd"])),
                                Eod = CastAide.AsString(row["eod"]) == string.Empty ? string.Empty : FormatHandler.FormatNumber3(row["eod"], "en-EN")
                            };

                        listTrans.Add(abTrans);
                    }
                }

                if (listTrans.Count > 0)
                {
                    instantReport.LastTStamp = listTrans[0].TStamp;
                }

                #endregion mapping trans

                var listLeague = new List<ABSLeague>();
                listLeague = (from string league in listTrans.Select(s => s.LeagueId).Distinct().ToList()
                              select new ABSLeague { Id = league, Name = CacheRef.GetLeagueName(league), IsHide = false }).
                    ToList();

                List<InstantReportDetailByHour> HoursList =
                    (from string hour in listTrans.Select(s => s.HourNo).Distinct().ToList()
                     select new InstantReportDetailByHour { HourNo = hour }).ToList();
                foreach (InstantReportDetailByHour hour in HoursList)
                {
                    string hourno = hour.HourNo;
                    IEnumerable<ABTrans> listTransByHour = listTrans.Where(s => s.HourNo == hourno);
                    IEnumerable<string> listMatchs = listTransByHour.Select(s => s.MatchCode);
                    IEnumerable<string> listMatchsDistinct = listMatchs.Distinct();

                    hour.Matchs = new List<ABMatch>();
                    foreach (string matchcode in listMatchsDistinct)
                    {
                        string matchcode1 = matchcode;

                        List<ABTrans> listTranByHourMatch = listTransByHour.Where(s => s.MatchCode == matchcode1).ToList();

                        #region FT Trans

                        List<ABTrans> listTranByHourMatchFT =
                            listTranByHourMatch.Where(s => s.BetType == "1" || s.BetType == "3" || s.BetType == "5").ToList(
                                );
                        if (listTranByHourMatchFT.Count > 0)
                        {
                            ABTrans firstItem = listTranByHourMatchFT.First();
                            var matchft = new ABMatch
                                {
                                    MatchCode = firstItem.MatchCode,
                                    BetType = "1_3_5",
                                    MatchDT =
                                        ("0" + firstItem.KickOffTime.Hour).Substring(
                                            ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                        +
                                        ("0" + firstItem.KickOffTime.Minute).Substring(
                                            ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                    MatchDate = firstItem.KickOffTime.ToString(),
                                    HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                    AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                    LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                    Trans = new List<ABTrans>()
                                };
                            matchft.Trans = listTranByHourMatchFT;
                            hour.Matchs.Add(matchft);
                        }

                        #endregion FT Trans

                        #region 1st Trans

                        List<ABTrans> listTranByHourMatch1st =
                            listTranByHourMatch.Where(s => s.BetType == "7" || s.BetType == "8" || s.BetType == "15").ToList
                                ();
                        if (listTranByHourMatch1st.Count > 0)
                        {
                            ABTrans firstItem = listTranByHourMatch1st.First();
                            var match1st = new ABMatch
                                {
                                    MatchCode = firstItem.MatchCode,
                                    BetType = "7_8_15",
                                    MatchDT =
                                        ("0" + firstItem.KickOffTime.Hour).Substring(
                                            ("0" + firstItem.KickOffTime.Hour).Length - 2, 2) + ":"
                                        +
                                        ("0" + firstItem.KickOffTime.Minute).Substring(
                                            ("0" + firstItem.KickOffTime.Minute).Length - 2, 2),
                                    MatchDate = firstItem.KickOffTime.ToString(),
                                    HomeName = CacheRef.GetTeamName(firstItem.HomeId),
                                    AwayName = CacheRef.GetTeamName(firstItem.AwayId),
                                    LeagueName = CacheRef.GetLeagueName(firstItem.LeagueId),
                                    Trans = new List<ABTrans>()
                                };
                            match1st.Trans = listTranByHourMatch1st;
                            hour.Matchs.Add(match1st);
                        }

                        #endregion 1st Trans
                    }
                                        
                }

                #region mapping full hours

                for (int i = 0; i < 24; i++)
                {
                    string _hourno = ("0" + i).Substring(("0" + i).Length - 2, 2);
                    IEnumerable<InstantReportDetailByHour> _hour = HoursList.Where(s => s.HourNo == _hourno);
                    if (_hour.Count() > 0)
                    {
                        instantReport.HoursList.Add(_hour.First());
                    }
                    else
                    {
                        instantReport.HoursList.Add(
                            new InstantReportDetailByHour
                                {
                                    HourNo = _hourno,
                                    TotalBets = 0,
                                    TotalMatchs = 0,
                                    IsNew = false,
                                    Matchs = new List<ABMatch>()
                                });
                    }
                }

                #endregion mapping full hours

                if (instantReport.LastTStamp != null)
                {
                    SessionExtension.AddSession(HttpContext.Current.Session, Key, DateTime.Now);
                    SessionExtension.AddSession(HttpContext.Current.Session, KeyTrans, reportparams.previouststamp);
                }
                instantReport.LeagueList = listLeague;
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return instantReport;
        }

        public List<ABSLeague> GetLeagueByDate(string date)
        {
            try
            {
                //get admin id
                int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
                DataSet dbresult = this._instantReportDataAccess.GetLeagueByDate(adminId, date, ReportHelper.MoveBetDay);
                return (from DataRow row in dbresult.Tables[0].Rows
                        select
                            new ABSLeague { Id = row["leagueid"].ToString(), Name = CacheRef.GetLeagueName(row["leagueid"]) }).OrderBy(l => l.Name).ToList(
                                    );
            }
            
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
                return new List<ABSLeague>();
            }

        }

        public List<ABSPunter> GetPunterByColor(string color)
        {
            try
            {
                //get admin id
                int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
                DataSet dbresult = this._instantReportDataAccess.GetPunterByColor(adminId, color);
                return (from DataRow row in dbresult.Tables[0].Rows
                        select
                            new ABSPunter
                                {
                                    Id = row["punterid"].ToString(),
                                    PunterCode = row["code"].ToString(),
                                    Color = row["color"].ToString(),
                                    isHide = false
                                }).ToList();
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return new List<ABSPunter>();
        }

        public string UpdateRemark(long transid, string remark)
        {
            return this._instantReportDataAccess.UpdateRemark(transid, remark);
        }

        #endregion Public Methods and Operators

        #region Methods

        private string ReplaceMatchCode(string Code)
        {
            Code =
                Code.Replace(" ", "a").Replace("-", "b").Replace("#", "h").Replace("%", "k").Replace("&", "i").Replace(
                    "*", "c").Replace(":", "d").Replace(".", "e").Replace("!", "f").Replace("@", "g").Replace(",", "h");
            return Code;
        }

        private string getTeamName(string betTeam, string bettype, object homeid, object awayid)
        {
            switch (bettype)
            {
                case "7":
                case "1":
                    return betTeam == "h" ? CacheRef.GetTeamName(homeid) : CacheRef.GetTeamName(awayid);
                case "5":
                    return "FT." + betTeam;
                case "15":
                    return "1st." + betTeam;
            }
            return betTeam == "h" ? "Over" : "Under";
        }

        #endregion Methods
    }
}