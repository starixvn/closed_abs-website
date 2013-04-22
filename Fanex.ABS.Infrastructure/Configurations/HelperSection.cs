// ----------------------------------------------------------------------
// <copyright file="HelperSection.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Configurations
{
    using System.Configuration;
    using System.Reflection;

    public class HelperSection : ConfigurationSection
    {
        #region Enums

        public enum HelperCollectionType
        {
            Currency
        }

        #endregion

        #region Public Properties

        public static HelperSection Instance
        {
            get
            {
                var spSection = ConfigurationManager.GetSection("HelperSection") as HelperSection;
                return spSection;
            }
        }

        [ConfigurationProperty("Currency", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(HelperCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public HelperCollection Currency
        {
            get
            {
                var spCollection = (HelperCollection)base["Currency"];
                return spCollection;
            }
        }

        #endregion

        #region Public Indexers

        public HelperCollection this[HelperCollectionType name]
        {
            get
            {
                var spCollection =
                    (HelperCollection)
                    this.GetType().GetProperty(name.ToString()).GetValue(this, BindingFlags.GetField, null, null, null);
                return spCollection;
            }
        }

        #endregion
    }

    public class HelperCollection : ConfigurationElementCollection
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

        public HelperElement this[int index]
        {
            get
            {
                return (HelperElement)this.BaseGet(index);
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

        public new HelperElement this[string Name]
        {
            get
            {
                return (HelperElement)BaseGet(Name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public void Add(HelperElement HelperElement)
        {
            this.BaseAdd(HelperElement);
        }

        public void Clear()
        {
            this.BaseClear();
        }

        public int IndexOf(HelperElement HelperElement)
        {
            return this.BaseIndexOf(HelperElement);
        }

        public void Remove(HelperElement HelperElement)
        {
            if (this.BaseIndexOf(HelperElement) >= 0)
            {
                this.BaseRemove(HelperElement.Name);
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
            return new HelperElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((HelperElement)element).Name;
        }

        #endregion
    }

    public class HelperElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("items", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(HelperCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public HelperCollection Items
        {
            get
            {
                var items = (HelperCollection)base["items"];
                return items;
            }
        }

        [ConfigurationProperty("name", IsRequired = true)]
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

        [ConfigurationProperty("value", IsRequired = false)]
        ////[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
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