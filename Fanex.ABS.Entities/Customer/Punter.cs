// ----------------------------------------------------------------------
// <copyright file="Punter.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.Customer
{
    using System;
    using System.Runtime.Serialization;

    [Serializable]
    [DataContract]
    public class Punter
    {
        #region Public Properties

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public bool Enabled { get; set; }

        [DataMember]
        public int ExchangeId { get; set; }

        [DataMember]
        public double FB1x2 { get; set; }

        [DataMember]
        public double FBAH { get; set; }

        [DataMember]
        public double FBOU { get; set; }

        [DataMember]
        public string PunterCode { get; set; }

        [DataMember]
        public int PunterCodeId { get; set; }

        [DataMember]
        public int TotalAdmin { get; set; }

        [DataMember]
        public int TotalMember { get; set; }

        [DataMember]
        public string UserName { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class PunterCode
    {
        #region Public Properties

        [DataMember]
        public string Code { get; set; }

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public bool IsChecked { get; set; }

        [DataMember]
        public int PunterCodeId { get; set; }

        #endregion
    }
}