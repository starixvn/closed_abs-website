// ----------------------------------------------------------------------
// <copyright file="UserControlBO.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.User
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public class UserControlBO
    {
        #region Public Properties

        [DataMember]
        public string FuncDesc { get; set; }

        [DataMember]
        public string FuncName { get; set; }

        [DataMember]
        public string GroupName { get; set; }

        [DataMember]
        public int ID { get; set; }

        [DataMember]
        public bool IsGroupHost { get; set; }

        [DataMember]
        public bool IsGroupRead { get; set; }

        [DataMember]
        public bool IsHost { get; set; }

        [DataMember]
        public bool IsRead { get; set; }

        [DataMember]
        public int ParentId { get; set; }

        [DataMember]
        public List<UserControlBO> SubFuncs { get; set; }

        [DataMember]
        public int TotalSub { get; set; }

        #endregion
    }
}