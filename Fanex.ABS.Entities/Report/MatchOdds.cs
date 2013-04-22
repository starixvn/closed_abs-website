// ----------------------------------------------------------------------
// <copyright file="MatchOdds.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.Report
{
    using System;
    using System.Runtime.Serialization;

    [Serializable]
    [DataContract]
    public class MatchOdds
    {
        #region Public Properties

        [DataMember]
        public int bettype { get; set; }

        [DataMember]
        public double ehd { get; set; }

        [DataMember]
        public double eod { get; set; }

        [DataMember]
        public int matchid { get; set; }

        #endregion
    }
}