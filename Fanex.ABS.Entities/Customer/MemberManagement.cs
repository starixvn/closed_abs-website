// ----------------------------------------------------------------------
// <copyright file="MemberManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.Customer
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [Serializable]
    [DataContract]
    public class MemberManagement
    {
        #region Public Properties

        [DataMember]
        public List<MemberDetail> Items { get; set; }

        [DataMember]
        public int TotalItem { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class MemberDetail
    {
        #region Public Properties

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public string Color { get; set; }

        [DataMember]
        public int CustId { get; set; }

        [DataMember]
        public string Danger { get; set; }

        [DataMember]
        public bool Enabled { get; set; }

        [DataMember]
        public string FBAH { get; set; }

        [DataMember]
        public string FBOU { get; set; }

        [DataMember]
        public string Level { get; set; }

        [DataMember]
        public string Username { get; set; }

        #endregion
    }
}