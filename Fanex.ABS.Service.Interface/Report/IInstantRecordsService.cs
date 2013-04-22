// ----------------------------------------------------------------------
// <copyright file="InstantRecordManagement.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Interface.Report
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using Fanex.ABS.Entities.Report;

    public interface IInstantRecordsService
    {
        InstantReportDetail GetInstantRecordData(InstantReportParams reportparams);

        InstantReportDetail GetInstantRecordUpdatedTransData(InstantReportParams reportparams);
    }
}