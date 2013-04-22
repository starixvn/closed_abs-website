// ----------------------------------------------------------------------
// <copyright file="DateTimeOption.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities
{
    using System;
    using System.Runtime.Serialization;

    [Serializable]
    [DataContract]
    public class DateTimeOption
    {
        #region Public Properties

        [DataMember]
        public string fdate { get; set; }

        [DataMember]
        public string tdate { get; set; }

        #endregion
    }
}