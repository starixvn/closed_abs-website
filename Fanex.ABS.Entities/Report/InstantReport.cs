// ----------------------------------------------------------------------
// <copyright file="InstantReport.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.Report
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [Serializable]
    [DataContract]
    public class ABSLeague
    {
        #region Public Properties

        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public bool IsHide { get; set; }

        [DataMember]
        public string Name { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class ABSPunter
    {
        #region Public Properties

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public string PunterCode { get; set; }

        [DataMember]
        public string fb_1x2 { get; set; }

        [DataMember]
        public string fb_ah { get; set; }

        [DataMember]
        public string fb_ou { get; set; }

        [DataMember]
        public bool isChecked { get; set; }

        [DataMember]
        public bool isHide { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class InstantReportDetail
    {
        #region Public Properties

        [DataMember]
        public List<InstantReportDetailByHour> HoursList { get; set; }

        [DataMember]
        public bool IsOverTime { get; set; }

        [DataMember]
        public string LastTStamp { get; set; }

        [DataMember]
        public List<ABSLeague> LeagueList { get; set; }

        [DataMember]
        public string MaxTrans { get; set; }

        [DataMember]
        public string MinTrans { get; set; }

        [DataMember]
        public string PreviousTStamp { get; set; }

        [DataMember]
        public List<ABSPunter> PunterList { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class InstantReportDetailUpdatedTrans
    {
        #region Public Properties

        [DataMember]
        public string LastTStamp { get; set; }

        [DataMember]
        public string MaxTrans { get; set; }

        [DataMember]
        public string MinTrans { get; set; }

        [DataMember]
        public string PreviousTStamp { get; set; }

        [DataMember]
        public List<ABTrans> RemovedTrans { get; set; }

        [DataMember]
        public List<ABTrans> Trans { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class InstantReportDetailByHour
    {
        #region Public Properties

        [DataMember]
        public string HourNo { get; set; }

        [DataMember]
        public bool IsNew { get; set; }

        [DataMember]
        public List<ABMatch> Matchs { get; set; }

        [DataMember]
        public int TotalBets { get; set; }

        [DataMember]
        public int TotalMatchs { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class ABMatch
    {
        #region Public Properties

        [DataMember]
        public string AwayId { get; set; }

        [DataMember]
        public string AwayName { get; set; }

        [DataMember]
        public string BetType { get; set; }

        [DataMember]
        public string HomeId { get; set; }

        [DataMember]
        public string HomeName { get; set; }

        [DataMember]
        public bool IsNew { get; set; }

        [DataMember]
        public string LeagueId { get; set; }

        [DataMember]
        public string LeagueName { get; set; }

        [DataMember]
        public string MatchCode { get; set; }

        [DataMember]
        public string MatchDT { get; set; }

        [DataMember]
        public string MatchDate { get; set; }

        [DataMember]
        public string MatchID { get; set; }

        [DataMember]
        public List<ABTrans> Trans { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class ABTrans
    {
        #region Public Properties

        [DataMember]
        public string AwayId { get; set; }

        [DataMember]
        public string BetTeam { get; set; }

        [DataMember]
        public string BetTeamName { get; set; }

        [DataMember]
        public string BetType { get; set; }

        [DataMember]
        public string BetTypeName { get; set; }

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public string CustId { get; set; }

        [DataMember]
        public string FinalAwayScore { get; set; }

        [DataMember]
        public string FinalHomeScore { get; set; }

        [DataMember]
        public string FirstOddHDP { get; set; }

        [DataMember]
        public string FirstOddOU { get; set; }

        [DataMember]
        public string Hdp { get; set; }

        [DataMember]
        public string HomeId { get; set; }

        [DataMember]
        public string HourNo { get; set; }

        public DateTime KickOffTime { get; set; }

        [DataMember]
        public string LeagueId { get; set; }

        [DataMember]
        public string LiveAwayScore { get; set; }

        [DataMember]
        public string LiveHomeScore { get; set; }

        [DataMember]
        public bool LiveIndicator { get; set; }

        [DataMember]
        public string MatchCode { get; set; }

        [DataMember]
        public string MatchCode2 { get; set; }

        [DataMember]
        public string MatchId { get; set; }

        [DataMember]
        public string Odds { get; set; }

        [DataMember]
        public string Eod { get; set; }

        [DataMember]
        public string PunterId { get; set; }

        [DataMember]
        public string PunterName { get; set; }

        [DataMember]
        public string Remark { get; set; }

        [DataMember]
        public string Stake { get; set; }

        [DataMember]
        public int StatusId { get; set; }

        [DataMember]
        public string TStamp { get; set; }

        [DataMember]
        public string TransDate { get; set; }

        [DataMember]
        public string TransId { get; set; }

        [DataMember]
        public string Winlost { get; set; }

        public string Ehd { get; set; }
        #endregion
    }

    public class InstantReportParams
    {
        #region Public Properties

        public int Awayid { get; set; }

        public int BetType { get; set; }

        public string EventDate { get; set; }

        public int EventStatus { get; set; }

        public int Homeid { get; set; }

        public string KickOffDate { get; set; }

        public string KickOffTime { get; set; }

        public string LeagueIds { get; set; }

        public string MatchCode { get; set; }

        public string MatchIds { get; set; }

        public double MaxTrans { get; set; }

        public double MinTrans { get; set; }

        public string PunterIds { get; set; }

        public string mintstamp { get; set; }

        public string previouststamp { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class InstantReport
    {
        #region Public Properties

        [DataMember]
        public List<InstantReportByHour> HoursList { get; set; }

        [DataMember]
        public string LastTStamp { get; set; }

        [DataMember]
        public string MaxTrans { get; set; }

        [DataMember]
        public string MinTrans { get; set; }

        [DataMember]
        public string PreviousTStamp { get; set; }

        [DataMember]
        public List<ABSPunter> PunterList { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class InstantReportByHour
    {
        #region Public Properties

        [DataMember]
        public string HourNo { get; set; }

        [DataMember]
        public bool IsNew { get; set; }

        [DataMember]
        public List<ABMatchUI> Matchs { get; set; }

        [DataMember]
        public int TotalBets { get; set; }

        [DataMember]
        public int TotalMatchs { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class ABMatchUI
    {
        #region Public Properties

        [DataMember]
        public List<ABSPunterInstant> AwayHdpPunters { get; set; }

        [DataMember]
        public string AwayId { get; set; }

        [DataMember]
        public string AwayName { get; set; }

        [DataMember]
        public List<ABSPunterInstant> AwayOUPunters { get; set; }

        [DataMember]
        public string BetType { get; set; }

        [DataMember]
        public List<ABSPunterInstant> HomeHdpPunters { get; set; }

        [DataMember]
        public string HomeId { get; set; }

        [DataMember]
        public string HomeName { get; set; }

        [DataMember]
        public List<ABSPunterInstant> HomeOUPunters { get; set; }

        [DataMember]
        public bool IsNew { get; set; }

        [DataMember]
        public string LeagueId { get; set; }

        [DataMember]
        public string LeagueName { get; set; }

        [DataMember]
        public string MatchDT { get; set; }

        [DataMember]
        public string MatchDate { get; set; }

        [DataMember]
        public string MatchID { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class ABSPunterInstant
    {
        #region Public Properties

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public string PunterCode { get; set; }

        [DataMember]
        public double TotalStake { get; set; }

        [DataMember]
        public bool isLimit { get; set; }

        [DataMember]
        public bool isNew { get; set; }

        [DataMember]
        public int totalBet { get; set; }

        #endregion
    }
}