// ----------------------------------------------------------------------
// <copyright file="Summary.cs" company="Nexcel">
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
    public class Summary
    {
        #region Public Properties

        [DataMember]
        public string Acc { get; set; }

        [DataMember]
        public double Betslip { get; set; }

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public int CustID { get; set; }

        [DataMember]
        public double Draw { get; set; }

        [DataMember]
        public string IsRunning { get; set; }

        [DataMember]
        public int LeagueId { get; set; }

        [DataMember]
        public string LeagueName { get; set; }

        [DataMember]
        public double Lose { get; set; }

        [DataMember]
        public double MPPercent { get; set; }

        [DataMember]
        public double TotalPL { get; set; }

        [DataMember]
        public double TotalStake { get; set; }

        [DataMember]
        public double Win { get; set; }

        [DataMember]
        public double WinPercent { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class SummaryDTO
    {
        #region Constructors and Destructors

        public SummaryDTO()
        {
            this.Summary = new List<Summary>();
        }

        #endregion

        #region Public Properties

        [DataMember]
        public List<Summary> Summary { get; set; }

        [DataMember]
        public Summary Total { get; set; }

        #endregion
    }
}