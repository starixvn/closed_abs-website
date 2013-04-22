// -----------------------------------------------------------------------
// <copyright file="ICommonService.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.ABS.Entities;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface ICommonService
    {
        Downtime GetDowntimeInfo();
    }
}