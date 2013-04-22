// ----------------------------------------------------------------------
// <copyright file="CustomerSection.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Configurations
{
    using System.Configuration;
    using System.Reflection;

    public class CustomerSection : ConfigurationSection
    {
        #region Enums

        public enum CustomerCollections
        {
            Currencies,

            Sites
        }

        #endregion

        #region Public Properties

        public static CustomerSection Instance
        {
            get
            {
                var customerSession = ConfigurationManager.GetSection("CustomerSection") as CustomerSection;
                return customerSession;
            }
        }

        [ConfigurationProperty("Currencies", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(CustomerCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public CustomerCollection Currencies
        {
            get
            {
                return (CustomerCollection)base["Currencies"];
            }
        }

        [ConfigurationProperty("Sites", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(CustomerCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public CustomerCollection Sites
        {
            get
            {
                return (CustomerCollection)base["Sites"];
            }
        }

        #endregion

        #region Public Indexers

        public CustomerCollection this[CustomerCollections name]
        {
            get
            {
                var UserGroupCollection =
                    (CustomerCollection)
                    this.GetType().GetProperty(name.ToString()).GetValue(this, BindingFlags.GetField, null, null, null);
                return UserGroupCollection;
            }
        }

        #endregion
    }

    public class CustomerCollection : ConfigurationElementCollection
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

        public CustomerElement this[int index]
        {
            get
            {
                return (CustomerElement)this.BaseGet(index);
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

        public new CustomerElement this[string Name]
        {
            get
            {
                return (CustomerElement)BaseGet(Name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public void Add(CustomerElement settingElement)
        {
            this.BaseAdd(settingElement);
        }

        public void Clear()
        {
            this.BaseClear();
        }

        public int IndexOf(CustomerElement settingElement)
        {
            return this.BaseIndexOf(settingElement);
        }

        public void Remove(CustomerElement settingElement)
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
            return new CustomerElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((CustomerElement)element).Name;
        }

        #endregion
    }

    public class CustomerElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("group", IsRequired = false)]
        public string Group
        {
            get
            {
                return (string)this["group"];
            }
            set
            {
                this["group"] = value;
            }
        }

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

        #endregion
    }
}