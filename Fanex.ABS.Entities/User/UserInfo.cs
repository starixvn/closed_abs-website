// ----------------------------------------------------------------------
// <copyright file="UserInfo.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.User
{
    using System.Runtime.Serialization;

    [DataContract]
    public class UserInfo
    {
        #region Public Properties

        [DataMember]
        public string CreatedDate { get; set; }

        [DataMember]
        public string Creator { get; set; }

        [DataMember]
        public string FName { get; set; }

        [DataMember]
        public int GroupId { get; set; }

        [DataMember]
        public string GroupName { get; set; }

        [DataMember]
        public string LName { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public int UserId { get; set; }

        [DataMember]
        public string UserName { get; set; }

        #endregion
    }

    [DataContract]
    public class UserSmallInfo
    {
        #region Public Properties

        [DataMember]
        public bool IsAssign { get; set; }

        [DataMember]
        public bool IsSupper { get; set; }

        [DataMember]
        public int UserId { get; set; }

        [DataMember]
        public string UserName { get; set; }

        #endregion
    }
}