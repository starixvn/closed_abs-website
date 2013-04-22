// -----------------------------------------------------------------------
// <copyright file="Downtime.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.ABS.Entities
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class Downtime
    {
        public string From { get; set; }

        public string To { get; set; }

        public bool IsDowntime { get; set; }
    }
}