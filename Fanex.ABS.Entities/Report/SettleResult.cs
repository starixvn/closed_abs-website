// ----------------------------------------------------------------------
// <copyright file="SettleResult.cs" company="Nexcel">
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
    public class SettleResult
    {
        #region Public Properties

        [DataMember]
        public string EventDate { get; set; }

        [DataMember]
        public int ID { get; set; }

        [DataMember]
        public List<SettleLeague> Leagues { get; set; }

        [DataMember]
        public string Name { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleLeague
    {
        #region Public Properties

        [DataMember]
        public List<SettleHorse> Horses { get; set; }

        [DataMember]
        public int League { get; set; }

        [DataMember]
        public string LeagueName { get; set; }

        [DataMember]
        public List<SettleMatch> Matches { get; set; }

        [DataMember]
        public int Sport { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleMatch
    {
        #region Public Properties

        [DataMember]
        public string ATeam { get; set; }

        [DataMember]
        public string Code { get; set; }

        [DataMember]
        public string HTeam { get; set; }

        [DataMember]
        public int ID { get; set; }

        [DataMember]
        public string KickOffTime { get; set; }

        [DataMember]
        public int League { get; set; }

        [DataMember]
        public SettleParam Param { get; set; }

        [DataMember]
        public string Status { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleParam
    {
        #region Public Properties

        [DataMember]
        public SettleGoal Goal { get; set; }

        [DataMember]
        public SettleQ NumQ { get; set; }

        [DataMember]
        public SettleScore Score { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleScore
    {
        #region Public Properties

        [DataMember]
        public string AwayFT { get; set; }

        [DataMember]
        public string AwayHT { get; set; }

        [DataMember]
        public string AwayTS { get; set; }

        [DataMember]
        public string HomeFT { get; set; }

        [DataMember]
        public string HomeHT { get; set; }

        [DataMember]
        public string HomeTS { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleGoal
    {
        #region Public Properties

        [DataMember]
        public string AwayFG { get; set; }

        [DataMember]
        public string AwayLG { get; set; }

        [DataMember]
        public string AwayTG { get; set; }

        [DataMember]
        public string History { get; set; }

        [DataMember]
        public string HomeFG { get; set; }

        [DataMember]
        public string HomeLG { get; set; }

        [DataMember]
        public string HomeTG { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleQ
    {
        #region Public Properties

        [DataMember]
        public string Away1Q { get; set; }

        [DataMember]
        public string Away2Q { get; set; }

        [DataMember]
        public string Away3Q { get; set; }

        [DataMember]
        public string Away4Q { get; set; }

        [DataMember]
        public string Away5Q { get; set; }

        [DataMember]
        public string Away6Q { get; set; }

        [DataMember]
        public string Away7Q { get; set; }

        [DataMember]
        public string Away8Q { get; set; }

        [DataMember]
        public string Away9Q { get; set; }

        [DataMember]
        public string AwayEI { get; set; }

        [DataMember]
        public string AwayOT { get; set; }

        [DataMember]
        public string Home1Q { get; set; }

        [DataMember]
        public string Home2Q { get; set; }

        [DataMember]
        public string Home3Q { get; set; }

        [DataMember]
        public string Home4Q { get; set; }

        [DataMember]
        public string Home5Q { get; set; }

        [DataMember]
        public string Home6Q { get; set; }

        [DataMember]
        public string Home7Q { get; set; }

        [DataMember]
        public string Home8Q { get; set; }

        [DataMember]
        public string Home9Q { get; set; }

        [DataMember]
        public string HomeEI { get; set; }

        [DataMember]
        public string HomeOT { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SettleHorse
    {
        #region Public Properties

        [DataMember]
        public string HorseName { get; set; }

        [DataMember]
        public string HorseNo { get; set; }

        [DataMember]
        public string Place { get; set; }

        [DataMember]
        public string Placeodds { get; set; }

        [DataMember]
        public string RaceName { get; set; }

        [DataMember]
        public string RaceNo { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public string Winodds { get; set; }

        #endregion
    }
}