// ----------------------------------------------------------------------
// <copyright file="LeagueDetail.cs" company="Nexcel">
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
    public class LeagueDetail
    {
        #region Public Properties

        [DataMember]
        public string Acc { get; set; }

        [DataMember]
        public string AwayName { get; set; }

        [DataMember]
        public string BT { get; set; }

        [DataMember]
        public string Betteam { get; set; }

        [DataMember]
        public int Bettype { get; set; }

        [DataMember]
        public string HDPGoal { get; set; }

        [DataMember]
        public decimal Hdp { get; set; }

        [DataMember]
        public string HomeName { get; set; }

        [DataMember]
        public string LeagueName { get; set; }

        [DataMember]
        public int LiveAwayScore { get; set; }

        [DataMember]
        public int LiveHomeScore { get; set; }

        [DataMember]
        public bool LiveIndicator { get; set; }

        [DataMember]
        public string MatchDate { get; set; }

        [DataMember]
        public double Odds { get; set; }

        [DataMember]
        public string Remarks { get; set; }

        [DataMember]
        public string Score { get; set; }

        [DataMember]
        public double Stake { get; set; }

        [DataMember]
        public int StatusId { get; set; }

        [DataMember]
        public double TotalPL { get; set; }

        [DataMember]
        public int index { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class LeagueDetailDTO
    {
        #region Constructors and Destructors

        public LeagueDetailDTO()
        {
            this.LeagueDetails = new List<LeagueDetail>();
        }

        #endregion

        #region Public Properties

        [DataMember]
        public List<LeagueDetail> LeagueDetails { get; set; }

        [DataMember]
        public double TotalPL { get; set; }

        [DataMember]
        public double TotalTurnOver { get; set; }

        #endregion
    }
}