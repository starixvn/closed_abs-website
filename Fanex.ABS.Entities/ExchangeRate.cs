// ----------------------------------------------------------------------
// <copyright file="ExchangeRate.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities
{
    using System;
    using System.Runtime.Serialization;

    /// <summary>
    /// ExchangeRate Object
    /// </summary>
    [Serializable]
    [DataContract]
    public class ExchangeRate
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets the currency.
        /// </summary>
        /// <value>
        /// The currency.
        /// </value>
        [DataMember]
        public string Currency { get; set; }

        /// <summary>
        /// Gets or sets the exchange id.
        /// </summary>
        /// <value>
        /// The exchange id.
        /// </value>
        [DataMember]
        public int ExchangeId { get; set; }

        #endregion
    }
}