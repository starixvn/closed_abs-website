// ----------------------------------------------------------------------
// <copyright file="JsonUtil.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Sunplus.Accounting.Core.Helper
{
    using System;
    using System.Collections;
    using System.Data;
    using System.IO;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Summary description for JsonUlti
    /// </summary>
    public class JsonUtil
    {
        #region Public Methods and Operators

        public static string ToJson(Hashtable data)
        {
            var o = new JObject();
            foreach (DictionaryEntry item in data)
            {
                o.Add(new JProperty(item.Key.ToString(), item.Value));
            }

            return JsonConvert.SerializeObject(o);
        }

        /// <summary>
        /// Serialize Oject or List<Object/> to Json data
        /// </summary>
        /// <param name="key">The key.</param>
        /// <param name="data">The data.</param>
        /// <returns></returns>
        public static string ToJson(string key, object data)
        {
            var json = new JObject();
            json[key] = new JValue(JsonConvert.SerializeObject(data));
            return JsonConvert.SerializeObject(json);
        }

        public static string ToJson(DataTable dataTable)
        {
            return Serialize(dataTable);
        }

        #endregion

        #region Methods

        private static string Serialize(object value)
        {
            Type type = value.GetType();

            var json = new JsonSerializer
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    ObjectCreationHandling = ObjectCreationHandling.Replace,
                    MissingMemberHandling = MissingMemberHandling.Ignore,
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                };

            if (type == typeof(DataRow))
            {
                json.Converters.Add(new DataRowConverter());
            }
            else if (type == typeof(DataTable))
            {
                json.Converters.Add(new DataTableConverter());
            }
            else if (type == typeof(DataSet))
            {
                json.Converters.Add(new DataSetConverter());
            }

            var sw = new StringWriter();
            var writer = new JsonTextWriter(sw) { Formatting = Formatting.None, QuoteChar = '"' };

            json.Serialize(writer, value);

            string output = sw.ToString();
            writer.Close();
            sw.Close();

            return output;
        }

        private object Deserialize(string jsonText, Type valueType)
        {
            var json = new JsonSerializer
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    ObjectCreationHandling = ObjectCreationHandling.Replace,
                    MissingMemberHandling = MissingMemberHandling.Ignore,
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                };

            var sr = new StringReader(jsonText);
            var reader = new JsonTextReader(sr);
            object result = json.Deserialize(reader, valueType);
            reader.Close();

            return result;
        }

        #endregion
    }

    /// <summary>
    /// Converts a <see cref="DataRow"/> object to and from JSON.
    /// </summary>
    public class DataRowConverter : JsonConverter
    {
        #region Public Methods and Operators

        public override bool CanConvert(Type objectType)
        {
            return typeof(DataRow).IsAssignableFrom(objectType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var row = value as DataRow;

            // *** HACK: need to use root serializer to write the column value
            //     should be fixed in next ver of JSON.NET with writer.Serialize(object)
            writer.WriteStartObject();
            foreach (DataColumn column in row.Table.Columns)
            {
                writer.WritePropertyName(column.ColumnName);
                serializer.Serialize(writer, row[column]);
            }
            writer.WriteEndObject();
        }

        #endregion
    }

    /// <summary>
    /// Converts a DataTable to JSON. Note no support for deserialization
    /// </summary>
    internal class DataTableConverter : JsonConverter
    {
        #region Public Methods and Operators

        public override bool CanConvert(Type valueType)
        {
            return typeof(DataTable).IsAssignableFrom(valueType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var table = value as DataTable;
            var converter = new DataRowConverter();

            writer.WriteStartObject();

            writer.WritePropertyName("Rows");
            writer.WriteStartArray();

            foreach (DataRow row in table.Rows)
            {
                converter.WriteJson(writer, row, serializer);
            }

            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        #endregion
    }

    /// <summary>
    /// Converts a <see cref="DataSet"/> object to JSON. No support for reading.
    /// </summary>
    internal class DataSetConverter : JsonConverter
    {
        #region Public Methods and Operators

        /// <summary>
        /// Determines whether this instance can convert the specified value type.
        /// </summary>
        /// <param name="valueType">Type of the value.</param>
        /// <returns>
        ///     <c>true</c> if this instance can convert the specified value type; otherwise, <c>false</c>.
        /// </returns>
        public override bool CanConvert(Type valueType)
        {
            return typeof(DataSet).IsAssignableFrom(valueType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var dataSet = value as DataSet;

            var converter = new DataTableConverter();

            writer.WriteStartObject();

            writer.WritePropertyName("Tables");
            writer.WriteStartArray();

            foreach (DataTable table in dataSet.Tables)
            {
                converter.WriteJson(writer, table, serializer);
            }
            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        #endregion
    }
}