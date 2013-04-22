// ----------------------------------------------------------------------
// <copyright file="PunterMember.cs" company="Nexcel">
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
    public class PunterMember
    {
        #region Public Properties

        [DataMember]
        public int MemberId { get; set; }

        [DataMember]
        public string MemberName { get; set; }

        #endregion
    }
}