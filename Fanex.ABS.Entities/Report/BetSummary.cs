// ----------------------------------------------------------------------
// <copyright file="BetSummary.cs" company="Nexcel">
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
    public class BetSummary
    {
        #region Public Properties

        [DataMember]
        public string HourNo { get; set; }

        [DataMember]
        public int NumberBets { get; set; }

        [DataMember]
        public int NumberMatchs { get; set; }

        #endregion
    }
}