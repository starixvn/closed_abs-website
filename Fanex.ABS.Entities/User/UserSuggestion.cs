// ----------------------------------------------------------------------
// <copyright file="UserSuggestion.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.User
{
    using System.Runtime.Serialization;

    [DataContract]
    public class UserSuggestion
    {
        #region Public Properties

        [DataMember]
        public string UserName { get; set; }

        #endregion
    }
}