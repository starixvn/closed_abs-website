// ----------------------------------------------------------------------
// <copyright file="MenuDetail.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities.User
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    /// <summary>
    /// Summary description for MenuBO
    /// </summary>
    [Serializable]
    [DataContract]
    public class MenuDetail
    {
        #region Public Properties

        [DataMember]
        public string FunctionName { get; set; }

        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public bool IsHide { get; set; }

        [DataMember]
        public bool IsOpenNewWindow { get; set; }

        [DataMember]
        public int Level { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public int Order { get; set; }

        [DataMember]
        public int ParentId { get; set; }

        [DataMember]
        public List<MenuDetail> SubMenu { get; set; }

        [DataMember]
        public string System { get; set; }

        [DataMember]
        public string Target { get; set; }

        [DataMember]
        public string Url { get; set; }

        #endregion
    }

    [Serializable]
    [DataContract]
    public class MenuSmallDetail
    {
        #region Public Properties

        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public int NumOfAppear { get; set; }

        [DataMember]
        public string Url { get; set; }

        #endregion
    }
}