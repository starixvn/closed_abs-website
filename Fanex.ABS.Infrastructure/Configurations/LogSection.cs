// ----------------------------------------------------------------------
// <copyright file="LogSection.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Configurations
{
    using System.Configuration;
    using System.Linq;

    public class LogSection : ConfigurationSection
    {
        #region Public Properties

        public static LogSection Instance
        {
            get
            {
                return ConfigurationManager.GetSection("LogSection") as LogSection;
            }
        }

        public TrackingTemplate DefaultTracking
        {
            get
            {
                return this.Tracking.Cast<TrackingTemplate>().Where(tracking => tracking.IsDefault).SingleOrDefault();
            }
        }

        [ConfigurationProperty("LogFormater", IsDefaultCollection = true)]
        public ParamCollection Formater
        {
            get
            {
                return (ParamCollection)this["LogFormater"];
            }
        }

        [ConfigurationProperty("Groups", IsDefaultCollection = true)]
        public GroupCollection Groups
        {
            get
            {
                return (GroupCollection)this["Groups"];
            }
        }

        [ConfigurationProperty("LogType", IsDefaultCollection = true)]
        public LogTypeCollection LogType
        {
            get
            {
                return (LogTypeCollection)this["LogType"];
            }
        }

        [ConfigurationProperty("TrackingTemplate", IsDefaultCollection = true)]
        public TrackingCollection Tracking
        {
            get
            {
                return (TrackingCollection)this["TrackingTemplate"];
            }
        }

        #endregion
    }

    #region Tracking Configuration

    [ConfigurationCollection(typeof(LogTypeElement), AddItemName = "type")]
    public class LogTypeCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "type";
            }
        }

        #endregion

        #region Public Indexers

        public new LogTypeElement this[string name]
        {
            get
            {
                return (LogTypeElement)BaseGet(name);
            }
        }

        public LogTypeElement this[int index]
        {
            get
            {
                return (LogTypeElement)this.BaseGet(index);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(LogTypeElement element)
        {
            return this.BaseIndexOf(element);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new LogTypeElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((LogTypeElement)element).Id;
        }

        #endregion
    }

    public class LogTypeElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("id", IsRequired = true, IsKey = true)]
        public string Id
        {
            get
            {
                return (string)this["id"];
            }
        }

        [ConfigurationProperty("isTracking", DefaultValue = false, IsRequired = false)]
        public bool IsTracking
        {
            get
            {
                return (bool)this["isTracking"];
            }
        }

        [ConfigurationProperty("name", DefaultValue = "")]
        public string Name
        {
            get
            {
                return (string)this["name"];
            }
        }

        #endregion
    }

    [ConfigurationCollection(typeof(TrackingTemplate), AddItemName = "tracking")]
    public class TrackingCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "tracking";
            }
        }

        #endregion

        #region Public Indexers

        public new TrackingTemplate this[string level]
        {
            get
            {
                return (TrackingTemplate)BaseGet(level);
            }
        }

        public TrackingTemplate this[int index]
        {
            get
            {
                return (TrackingTemplate)this.BaseGet(index);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(TrackingTemplate TrackingTemplate)
        {
            return this.BaseIndexOf(TrackingTemplate);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new TrackingTemplate();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((TrackingTemplate)element).Level;
        }

        #endregion
    }

    public class TrackingTemplate : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("action", DefaultValue = "*", IsRequired = true)]
        public string Action
        {
            get
            {
                return (string)this["action"];
            }
        }

        [ConfigurationProperty("filters", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(ActionCollection), AddItemName = "action", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public ActionCollection Filters
        {
            get
            {
                return (ActionCollection)this["filters"];
            }
        }

        [ConfigurationProperty("formater", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(ParamCollection), AddItemName = "param", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public ParamCollection Formater
        {
            get
            {
                return (ParamCollection)this["formater"];
            }
        }

        [ConfigurationProperty("groupDefault", DefaultValue = "", IsRequired = false)]
        public string GroupDefault
        {
            get
            {
                return (string)this["groupDefault"];
            }
        }

        [ConfigurationProperty("hasGroup", DefaultValue = false, IsRequired = false)]
        public bool HasGroup
        {
            get
            {
                return (bool)this["hasGroup"];
            }
        }

        [ConfigurationProperty("hiddenDefault", DefaultValue = "", IsRequired = false)]
        public string HiddenDefault
        {
            get
            {
                return (string)this["hiddenDefault"];
            }
        }

        [ConfigurationProperty("information", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(InformationCollection), AddItemName = "info", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public InformationCollection Information
        {
            get
            {
                return (InformationCollection)this["information"];
            }
        }

        [ConfigurationProperty("isDefault", DefaultValue = false, IsRequired = false)]
        public bool IsDefault
        {
            get
            {
                return (bool)this["isDefault"];
            }
        }

        [ConfigurationProperty("level", DefaultValue = "0", IsRequired = true, IsKey = true)]
        public int Level
        {
            get
            {
                return (int)this["level"];
            }
        }

        [ConfigurationProperty("params", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(ParamCollection), AddItemName = "param", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public ParamCollection Params
        {
            get
            {
                return (ParamCollection)this["params"];
            }
        }

        #endregion
    }

    [ConfigurationCollection(typeof(ActionElement), AddItemName = "action")]
    public class ActionCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "action";
            }
        }

        #endregion

        #region Public Indexers

        public ActionElement this[int id]
        {
            get
            {
                return (ActionElement)this.BaseGet(id);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(ActionElement actionElement)
        {
            return this.BaseIndexOf(actionElement);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new ActionElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((ActionElement)element).Id;
        }

        #endregion
    }

    public class ActionElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("groupName", DefaultValue = "", IsRequired = false)]
        public string GroupName
        {
            get
            {
                return this["groupName"].ToString();
            }
        }

        [ConfigurationProperty("hidden", DefaultValue = "", IsRequired = false)]
        public string Hidden
        {
            get
            {
                return this["hidden"].ToString();
            }
        }

        [ConfigurationProperty("id", IsRequired = true, IsKey = true)]
        public int Id
        {
            get
            {
                return (int)this["id"];
            }
        }

        [ConfigurationProperty("prefix", DefaultValue = "")]
        public string Prefix
        {
            get
            {
                return this["prefix"].ToString();
            }
        }

        [ConfigurationProperty("regx", DefaultValue = "")]
        public string Regx
        {
            get
            {
                return this["regx"].ToString();
            }
        }

        #endregion
    }

    [ConfigurationCollection(typeof(ParamElement), AddItemName = "param")]
    public class ParamCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "param";
            }
        }

        #endregion

        #region Public Indexers

        public ParamElement this[string name]
        {
            get
            {
                return (ParamElement)BaseGet(name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(ParamElement element)
        {
            return this.BaseIndexOf(element);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new ParamElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((ParamElement)element).Name;
        }

        #endregion
    }

    public class ParamElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("name", IsRequired = true, IsKey = true)]
        public string Name
        {
            get
            {
                return (string)this["name"];
            }
        }

        [ConfigurationProperty("value")]
        public string Value
        {
            get
            {
                return this["value"].ToString();
            }
        }

        #endregion
    }

    [ConfigurationCollection(typeof(ParamElement), AddItemName = "info")]
    public class InformationCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "info";
            }
        }

        #endregion

        #region Public Indexers

        public InfoElement this[string name]
        {
            get
            {
                return (InfoElement)BaseGet(name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(InfoElement element)
        {
            return this.BaseIndexOf(element);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new InfoElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((InfoElement)element).Name;
        }

        #endregion
    }

    public class InfoElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("groupSport", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(GroupSportCollection), AddItemName = "sport", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public GroupSportCollection GroupSport
        {
            get
            {
                return (GroupSportCollection)this["groupSport"];
            }
        }

        [ConfigurationProperty("name", IsRequired = true, IsKey = true)]
        public string Name
        {
            get
            {
                return (string)this["name"];
            }
        }

        [ConfigurationProperty("params", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(ParamCollection), AddItemName = "param", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public ParamCollection Params
        {
            get
            {
                return (ParamCollection)this["params"];
            }
        }

        #endregion
    }

    [ConfigurationCollection(typeof(ParamElement), AddItemName = "sport")]
    public class GroupSportCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "sport";
            }
        }

        #endregion

        #region Public Indexers

        public SportInfoElement this[string name]
        {
            get
            {
                return (SportInfoElement)BaseGet(name);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(SportInfoElement element)
        {
            return this.BaseIndexOf(element);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new SportInfoElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((SportInfoElement)element).Name;
        }

        #endregion
    }

    public class SportInfoElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("name", IsRequired = true, IsKey = true)]
        public string Name
        {
            get
            {
                return (string)this["name"];
            }
        }

        [ConfigurationProperty("params", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(ParamCollection), AddItemName = "param", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public ParamCollection Params
        {
            get
            {
                return (ParamCollection)this["params"];
            }
        }

        #endregion
    }

    #endregion Tracking Configuration

    #region Group Configuration

    [ConfigurationCollection(typeof(GroupElement), AddItemName = "group")]
    public class GroupCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "group";
            }
        }

        #endregion

        #region Public Indexers

        public GroupElement this[string name]
        {
            get
            {
                return (GroupElement)BaseGet(name);
            }
        }

        public GroupElement this[int index]
        {
            get
            {
                return (GroupElement)this.BaseGet(index);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(GroupElement groupElement)
        {
            return this.BaseIndexOf(groupElement);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new GroupElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((GroupElement)element).Name;
        }

        #endregion
    }

    public class GroupElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("name", IsRequired = true, IsKey = true)]
        public string Name
        {
            get
            {
                return this["name"].ToString();
            }
        }

        [ConfigurationProperty("sports", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(SportCollection), AddItemName = "add", ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public SportCollection Sports
        {
            get
            {
                return (SportCollection)this["sports"];
            }
        }

        #endregion
    }

    [ConfigurationCollection(typeof(SportElement), AddItemName = "add")]
    public class SportCollection : ConfigurationElementCollection
    {
        #region Public Properties

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMap;
            }
        }

        #endregion

        #region Properties

        protected override string ElementName
        {
            get
            {
                return "add";
            }
        }

        #endregion

        #region Public Indexers

        public SportElement this[string name]
        {
            get
            {
                return (SportElement)BaseGet(name);
            }
        }

        public SportElement this[int index]
        {
            get
            {
                return (SportElement)this.BaseGet(index);
            }
        }

        #endregion

        #region Public Methods and Operators

        public int IndexOf(SportElement groupElement)
        {
            return this.BaseIndexOf(groupElement);
        }

        #endregion

        #region Methods

        protected override ConfigurationElement CreateNewElement()
        {
            return new SportElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((SportElement)element).Id;
        }

        #endregion
    }

    public class SportElement : ConfigurationElement
    {
        #region Public Properties

        [ConfigurationProperty("id", IsRequired = true, IsKey = true)]
        public int Id
        {
            get
            {
                return (int)this["id"];
            }
        }

        [ConfigurationProperty("label", IsRequired = true)]
        public string Label
        {
            get
            {
                return this["label"].ToString();
            }
        }

        #endregion
    }

    #endregion Group Configuration
}