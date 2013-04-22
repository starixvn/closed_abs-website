// ----------------------------------------------------------------------
// <copyright file="MailSection.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Configurations
{
    using System.Configuration;
    using System.Reflection;

    using DNAide.Core;
    using DNAide.Utils;

    /// <summary>
    /// Summary description for MailSetting
    /// </summary>
    public class MailSection : ConfigurationSection
    {
        #region Enums

        public enum HostName
        {
            Gmail,

            IBC
        }

        public enum Setting
        {
            Server,

            Send
        }

        #endregion

        #region Public Properties

        public static string BCCMail
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["bccMail"]);
            }
        }

        public static string BCCMail12BetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMail12BetCSD"]);
            }
        }

        public static string BCCMail12EUCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMail12EUCSD"]);
            }
        }

        public static string BCCMailAlogCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailAlogCSD"]);
            }
        }

        public static string BCCMailAsiaBetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailAsiaBetCSD"]);
            }
        }

        public static string BCCMailBugSystem
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailBugSystem"]);
            }
        }

        public static string BCCMailDelaCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailDelaCSD"]);
            }
        }

        public static string BCCMailExchangeRate
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailExchangeRate"]);
            }
        }

        public static string BCCMailFIAutoDummyTransfer
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailFIAutoDummyTransfer"]);
            }
        }

        public static string BCCMailHRGroup
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailHRGroup"]);
            }
        }

        public static string BCCMailMansion88CSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailMansion88CSD"]);
            }
        }

        public static string BCCMailMayfairCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailMayfairCSD"]);
            }
        }

        public static string BCCMailRecoverBetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailRecoverBetCSD"]);
            }
        }

        public static string BCCMailSpondemoCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailSpondemoCSD"]);
            }
        }

        public static string BCCMailSuncityCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailSuncityCSD"]);
            }
        }

        public static string BCCMailTLCCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailTLCCSD"]);
            }
        }

        public static string BCCMailZzun88CSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["BCCMailZzun88CSD"]);
            }
        }

        public static string CCMail
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ccMail"]);
            }
        }

        public static string CCMail12BetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMail12BetCSD"]);
            }
        }

        public static string CCMail12EUCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMail12EUCSD"]);
            }
        }

        public static string CCMailAlogCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailAlogCSD"]);
            }
        }

        public static string CCMailAsiaBetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailAsiaBetCSD"]);
            }
        }

        public static string CCMailBugSystem
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailBugSystem"]);
            }
        }

        public static string CCMailDelaCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailDelaCSD"]);
            }
        }

        public static string CCMailExchangeRate
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailExchangeRate"]);
            }
        }

        public static string CCMailFIAutoDummyTransfer
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailFIAutoDummyTransfer"]);
            }
        }

        public static string CCMailHRGroup
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailHRGroup"]);
            }
        }

        public static string CCMailMansion88CSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailMansion88CSD"]);
            }
        }

        public static string CCMailMayfairCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailMayfairCSD"]);
            }
        }

        public static string CCMailRecoverBetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailRecoverBetCSD"]);
            }
        }

        public static string CCMailSpondemoCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailSpondemoCSD"]);
            }
        }

        public static string CCMailSuncityCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailSuncityCSD"]);
            }
        }

        public static string CCMailTLCCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailTLCCSD"]);
            }
        }

        public static string CCMailZzun88CSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["CCMailZzun88CSD"]);
            }
        }

        public static string FromMail
        {
            get
            {
                return ConfigurationManager.AppSettings["fromMail"];
            }
        }

        public static MailSection Instance
        {
            get
            {
                var spSection = ConfigurationManager.GetSection("MailSection") as MailSection;
                return spSection;
            }
        }

        public static string MailPwd
        {
            get
            {
                return Encryption.CfsDeCrypt(ConfigurationManager.AppSettings["emailPwd"]);
            }
        }

        public static string MailServer
        {
            get
            {
                return ConfigurationManager.AppSettings["mailServer"];
            }
        }

        public static int Port
        {
            get
            {
                return CastAide.AsInt32(ConfigurationManager.AppSettings["port"]);
            }
        }

        public static string ToMail12BetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMail12BetCSD"]);
            }
        }

        public static string ToMail12EUCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMail12EUCSD"]);
            }
        }

        public static string ToMailAlogCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailAlogCSD"]);
            }
        }

        public static string ToMailAsiaBetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailAsiaBetCSD"]);
            }
        }

        public static string ToMailBugSystem
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailBugSystem"]);
            }
        }

        public static string ToMailDelaCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailDelaCSD"]);
            }
        }

        public static string ToMailExchangeRate
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailExchangeRate"]);
            }
        }

        public static string ToMailFIAutoDummyTransfer
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailFIAutoDummyTransfer"]);
            }
        }

        public static string ToMailHRGroup
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailHRGroup"]);
            }
        }

        public static string ToMailMansion88CSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailMansion88CSD"]);
            }
        }

        public static string ToMailMayfairCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailMayfairCSD"]);
            }
        }

        public static string ToMailRecoverBetCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailRecoverBetCSD"]);
            }
        }

        public static string ToMailSpondemoCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailSpondemoCSD"]);
            }
        }

        public static string ToMailSuncityCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailSuncityCSD"]);
            }
        }

        public static string ToMailTLCCSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailTLCCSD"]);
            }
        }

        public static string ToMailZzun88CSD
        {
            get
            {
                return CastAide.AsString(ConfigurationManager.AppSettings["ToMailZzun88CSD"]);
            }
        }

        [ConfigurationProperty("Active", IsDefaultCollection = false, DefaultValue = "Gmail")]
        public string Active
        {
            get
            {
                var active = (string)base["Active"];
                return active;
            }
        }

        [ConfigurationProperty("Send", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(MailCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public MailCollection Send
        {
            get
            {
                var spCollection = (MailCollection)base["Send"];
                return spCollection;
            }
        }

        [ConfigurationProperty("Server", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(MailCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public MailCollection Server
        {
            get
            {
                var spCollection = (MailCollection)base["Server"];
                return spCollection;
            }
        }

        #endregion

        #region Public Indexers

        public MailCollection this[Setting name]
        {
            get
            {
                var spCollection =
                    (MailCollection)
                    this.GetType().GetProperty(name.ToString()).GetValue(this, BindingFlags.GetField, null, null, null);
                return spCollection;
            }
        }

        #endregion
    }

    public class MailCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.AddRemoveClearMap;
            }
        }

        #endregion

        #region Public Indexers

        public MailElement this[int index]
        {
            get
            {
                return (MailElement)this.BaseGet(index);
            }
            set
            {
                if (this.BaseGet(index) != null)
                {
                    this.BaseRemoveAt(index);
                }
                BaseAdd(index, value);
            }
        }

        public new MailElement this[string Name]
        {
            get
            {
                return (MailElement)BaseGet(Name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public void Add(MailElement mailElement)
        {
            this.BaseAdd(mailElement);
        }

        public void Clear()
        {
            this.BaseClear();
        }

        public int IndexOf(MailElement mailElement)
        {
            return this.BaseIndexOf(mailElement);
        }

        public void Remove(MailElement mailElement)
        {
            if (this.BaseIndexOf(mailElement) >= 0)
            {
                this.BaseRemove(mailElement.Name);
            }
        }

        public void Remove(string alias)
        {
            this.BaseRemove(alias);
        }

        public void RemoveAt(int index)
        {
            this.BaseRemoveAt(index);
        }

        #endregion

        #region Methods

        protected override void BaseAdd(ConfigurationElement element)
        {
            this.BaseAdd(element, false);
        }

        protected override sealed ConfigurationElement CreateNewElement()
        {
            return new MailElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((MailElement)element).Name;
        }

        #endregion
    }

    public class MailElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("auth", IsRequired = false, DefaultValue = true)]
        public bool Auth
        {
            get
            {
                return (bool)this["auth"];
            }
            set
            {
                this["auth"] = value;
            }
        }

        [ConfigurationProperty("bcc", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string Bcc
        {
            get
            {
                return (string)this["bcc"];
            }
            set
            {
                this["bcc"] = value;
            }
        }

        [ConfigurationProperty("cc", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string Cc
        {
            get
            {
                return (string)this["cc"];
            }
            set
            {
                this["cc"] = value;
            }
        }

        [ConfigurationProperty("from", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string From
        {
            get
            {
                return (string)this["from"];
            }
            set
            {
                this["from"] = value;
            }
        }

        [ConfigurationProperty("host", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string Host
        {
            get
            {
                return (string)this["host"];
            }
            set
            {
                this["host"] = value;
            }
        }

        [ConfigurationProperty("mails", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(MailCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public MailCollection Mails
        {
            get
            {
                var stores = (MailCollection)base["mails"];
                return stores;
            }
        }

        [ConfigurationProperty("name", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string Name
        {
            get
            {
                return (string)this["name"];
            }
            set
            {
                this["name"] = value;
            }
        }

        [ConfigurationProperty("password", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string Password
        {
            get
            {
                return (string)this["password"];
            }
            set
            {
                this["password"] = value;
            }
        }

        [ConfigurationProperty("port", IsRequired = false, DefaultValue = 25)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public int Port
        {
            get
            {
                return (int)this["port"];
            }
            set
            {
                this["port"] = value;
            }
        }

        [ConfigurationProperty("subject", DefaultValue = "", IsRequired = false)]
        public string Subject
        {
            get
            {
                return (string)this["subject"];
            }
        }

        [ConfigurationProperty("title", DefaultValue = "", IsRequired = false)]
        public string Title
        {
            get
            {
                return (string)this["title"];
            }
        }

        [ConfigurationProperty("to", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string To
        {
            get
            {
                return (string)this["to"];
            }
            set
            {
                this["to"] = value;
            }
        }

        [ConfigurationProperty("username", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
            public string Username
        {
            get
            {
                return (string)this["username"];
            }
            set
            {
                this["username"] = value;
            }
        }

        #endregion
    }
}