// ----------------------------------------------------------------------
// <copyright file="MemberManagementSection.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Configurations
{
    using System.Configuration;
    using System.Reflection;

    public class MemberManagementSection : ConfigurationSection
    {
        #region Enums

        public enum MemberManagementCollections
        {
            Admin
        }

        #endregion

        #region Public Properties

        public static MemberManagementSection Instance
        {
            get
            {
                var memberManagementSection =
                    ConfigurationManager.GetSection("MemberManagementSection") as MemberManagementSection;
                return memberManagementSection;
            }
        }

        [ConfigurationProperty("Admin", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(CustomerCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public MemberManagementCollection Admin
        {
            get
            {
                return (MemberManagementCollection)base["Admin"];
            }
        }

        #endregion

        #region Public Indexers

        public MemberManagementCollection this[MemberManagementCollections name]
        {
            get
            {
                var memberManagementCollection =
                    (MemberManagementCollection)
                    this.GetType().GetProperty(name.ToString()).GetValue(this, BindingFlags.GetField, null, null, null);
                return memberManagementCollection;
            }
        }

        #endregion
    }

    public class MemberManagementCollection : ConfigurationElementCollection
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

        public MemberManagementElement this[int index]
        {
            get
            {
                return (MemberManagementElement)this.BaseGet(index);
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

        public new MemberManagementElement this[string Name]
        {
            get
            {
                return (MemberManagementElement)BaseGet(Name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public void Add(MemberManagementElement settingElement)
        {
            this.BaseAdd(settingElement);
        }

        public void Clear()
        {
            this.BaseClear();
        }

        public int IndexOf(MemberManagementElement settingElement)
        {
            return this.BaseIndexOf(settingElement);
        }

        public void Remove(MemberManagementElement settingElement)
        {
            if (this.BaseIndexOf(settingElement) >= 0)
            {
                this.BaseRemove(settingElement.Name);
            }
        }

        public void Remove(string name)
        {
            this.BaseRemove(name);
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
            return new MemberManagementElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((MemberManagementElement)element).Name;
        }

        #endregion
    }

    public class MemberManagementElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("name", IsRequired = false)]
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

        [ConfigurationProperty("value", IsRequired = false)]
        public string Value
        {
            get
            {
                return (string)this["value"];
            }
            set
            {
                this["value"] = value;
            }
        }

        #endregion
    }
}