// ----------------------------------------------------------------------
// <copyright file="StringUtils.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Sunplus.Accounting.Core.Helper
{
    using System;
    using System.Text.RegularExpressions;

    /// <summary>
    /// Summary description for StringUtils
    /// </summary>
    public class StringUtils
    {
        #region Public Methods and Operators

        public static string ExtractDomainNameFromURL(string Url)
        {
            return Regex.Replace(Url, @"^([a-zA-Z]+:\/\/)?([^\/]+)\/.*?$", "$2");
        }

        public static string FormatErrorString(string errMsg)
        {
            return "<span style='color:#ff0000'>" + errMsg + "</span>";
        }

        public static string JS_Alert(string msg)
        {
            string qoute = Convert.ToChar(34).ToString();
            string alert = "alert(" + qoute + msg + qoute + ");";
            return alert;
        }

        public static string ParseToJSMsg(string data)
        {
            string specQuote = Convert.ToChar(34).ToString();
            return data.Replace(specQuote, "&quot;").Replace("'", "&rsquo;").Replace(Environment.NewLine, string.Empty);
        }

        public static string ParseToJSMsg1(string data)
        {
            return data.Replace("'", "&rsquo;").Replace(Environment.NewLine, string.Empty);
        }

        public static string ToHTMLString(string data)
        {
            return data.Replace("'", "&#39;");
        }

        #endregion
    }
}