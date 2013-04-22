// ----------------------------------------------------------------------
// <copyright file="SummaryReport.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Report
{
    using System;
    using System.Drawing;
    using System.Linq;
    using System.Web;
    using DNAide.Core;
    using ExcelUtil.Spreadsheet;
    using Fanex.ABS.DataAccess.Impl;
    using Fanex.ABS.Entities;
    using Fanex.ABS.Entities.Report;
    using Fanex.ABS.Infrastructure.Constants;
    using Fanex.ABS.Service.Impl.Helper;
    using Fanex.ABS.Service.Interface.Report;
    using Nexcel.ABS.DataAccess.Interface;

    public class SummaryReportService : ISummaryReportService
    {
        #region Constants and Fields

        private readonly ISummaryReportDataAccess _summaryReportDataAccess;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public SummaryReportService()
        {
            this._summaryReportDataAccess = new SummaryReportDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        public ExcelFile ExportExcelLeagueDeatil(string acc)
        {
            var excelFile = new ExcelFile();

            string strTitle = "Summary Report League Detail";

            ExcelWorksheet wsReport = excelFile.Worksheets.Add(strTitle);

            string numberFormat = string.Format("#,##0{0}_);-#,##0{1}", ".00", ".00");

            int curIndexRow = 0;
            int curIndexCol = 0;

            wsReport.Columns[1].Width = 255 * 5;
            wsReport.Columns[2].Width = 255 * 15;
            wsReport.Columns[3].Width = 255 * 15;
            wsReport.Columns[4].Width = 255 * 20;
            wsReport.Columns[5].Width = 255 * 32;
            wsReport.Columns[6].Width = 255 * 28;
            wsReport.Columns[7].Width = 255 * 24;
            wsReport.Columns[8].Width = 255 * 10;
            wsReport.Columns[9].Width = 255 * 10;
            wsReport.Columns[10].Width = 255 * 14;
            wsReport.Columns[11].Width = 255 * 14;

            #region title

            curIndexCol = 5;
            wsReport.Rows[curIndexRow].Height = 255 * 2;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 4).Merged = true;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 4).Style.Font.Weight
                = ExcelFont.BoldWeight;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 4).Style.Font.Size =
                288;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 4).Style.
                HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 4).Style.
                VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 4).Value = strTitle;

            #endregion title

            #region table header

            curIndexRow += 2;
            curIndexCol = 1;

            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Match Date";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Acc";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "BT";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "League";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Match Detail";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Team Pick";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "HDP/Goal";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Odds";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Stake";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Total P&L";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Remark";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Score";

            #endregion table header

            #region body

            var leagueDetailDTO = HttpContext.Current.Session["SUMMARY_REPORT_LEAGUE_DETAIL"] as LeagueDetailDTO;
            if (leagueDetailDTO == null)
            {
                goto end;
            }

            bool isEven = true;
            int index = 0;
            foreach (LeagueDetail ld in leagueDetailDTO.LeagueDetails)
            {
                ++curIndexRow;
                curIndexCol = 1;

                Color backgroundColor = Color.White;

                if (isEven)
                {
                    backgroundColor = Color.FromArgb(237, 236, 235);
                }

                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ++index;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.MatchDate;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Acc;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = (ld.LiveIndicator ? "Live " : "") + ld.BT;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.LeagueName;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                if (ld.LiveIndicator)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.HomeName + " vs " + ld.AwayName + " "
                                                                          + ld.LiveHomeScore.ToString() + " - "
                                                                          + ld.LiveAwayScore.ToString();
                }
                else
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.HomeName + " vs " + ld.AwayName;
                }

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                if (ld.Bettype == 1 || ld.Bettype == 7)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Betteam == "h" ? ld.HomeName : ld.AwayName;
                }
                else if (ld.Bettype == 3 || ld.Bettype == 8)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Betteam == "h" ? "Over" : "Under";
                }
                else if (ld.Bettype == 5 || ld.Bettype == 15)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = (ld.Bettype == 5 ? "FT." : "1st.")
                                                                          + ld.Betteam;
                }

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.HDPGoal;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
                if (ld.Hdp < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Odds;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Stake;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
                if (ld.Stake < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                if (ld.StatusId != 0 && ld.StatusId != 1)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.TotalPL;
                }
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
                if (ld.TotalPL < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Remarks;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ld.Score;

                isEven = !isEven;
            }

            #endregion body

            #region total

            ++curIndexRow;
            curIndexCol = 1;

            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Merged = true;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Style.Font.Weight
                = ExcelFont.BoldWeight;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Style.
                HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Style.
                VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Value = "Total";
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Style.Font.Color
                = Color.White;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 8).Style.FillPattern
                .SetSolid(Color.FromArgb(59, 89, 152));

            curIndexCol = 10;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = leagueDetailDTO.TotalTurnOver;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            if (leagueDetailDTO.TotalPL != 0)
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = leagueDetailDTO.TotalPL;
            }
            if (leagueDetailDTO.TotalPL < 0)
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
            }
            else
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            }
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));

            #endregion total

        end:
            return excelFile;
        }

        public ExcelFile ExportExcelMain(string type)
        {
            var excelFile = new ExcelFile();

            string strTitle = "";
            string columnTitle = "";
            switch (type)
            {
                case "main":
                    strTitle = "Summary Report";
                    columnTitle = "Acc";
                    break;
                case "league":
                    strTitle = "Summary Report By League";
                    columnTitle = "Leagues";
                    break;
            }

            ExcelWorksheet wsReport = excelFile.Worksheets.Add(strTitle);

            int curIndexRow = 0;
            int curIndexCol = 0;

            wsReport.Columns[1].Width = 255 * 6;
            wsReport.Columns[2].Width = 255 * 18;
            wsReport.Columns[8].Width = 255 * 18;
            wsReport.Columns[9].Width = 255 * 18;
            wsReport.Columns[10].Width = 255 * 18;

            #region title

            curIndexCol = 5;
            wsReport.Rows[curIndexRow].Height = 255 * 2;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 3).Merged = true;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 3).Style.Font.Weight
                = ExcelFont.BoldWeight;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 3).Style.Font.Size =
                288;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 3).Style.
                HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 3).Style.
                VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Cells.GetSubrangeAbsolute(curIndexRow, curIndexCol, curIndexRow, curIndexCol + 3).Value = strTitle;

            #endregion title

            #region table header

            curIndexRow += 2;
            curIndexCol = 1;

            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = columnTitle;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Betslip";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Win";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Draw";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Lose";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Win%";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Total Stake";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Total P&L";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "MP%";

            #endregion table header

            SummaryDTO summaryDTO;
            if (type == "main")
            {
                summaryDTO = HttpContext.Current.Session["SUMMARY_REPORT_MAIN"] as SummaryDTO;
            }
            else
            {
                summaryDTO = HttpContext.Current.Session["SUMMARY_REPORT_LEAGUE"] as SummaryDTO;
                if (summaryDTO != null && summaryDTO.Summary.Count > 0)
                {
                    summaryDTO.Summary = summaryDTO.Summary.OrderBy(s => s.LeagueName).ToList();
                }
            }
            if (summaryDTO == null)
            {
                goto end;
            }

            string numberFormat = string.Format("#,##0{0}_);-#,##0{1}", ".00", ".00");

            #region body

            bool isEven = true;
            int index = 0;
            foreach (Summary sumarry in summaryDTO.Summary)
            {
                ++curIndexRow;
                curIndexCol = 1;

                Color backgroundColor = Color.White;

                if (isEven)
                {
                    backgroundColor = Color.FromArgb(237, 236, 235);
                }

                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = ++index;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = ColorTranslator.FromHtml(sumarry.Color);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                if (type == "main")
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.Acc;
                }
                else
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.LeagueName;
                }

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.Betslip;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.Win;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.Draw;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment =
                    HorizontalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.Lose;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                if (sumarry.WinPercent < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.WinPercent;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                if (sumarry.TotalStake < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.TotalStake;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                if (sumarry.TotalPL < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.TotalPL;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;

                ++curIndexCol;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                    MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                    Color.FromArgb(124, 152, 164),
                    LineStyle.Thin);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                if (sumarry.MPPercent < 0)
                {
                    wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
                }
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(backgroundColor);
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = sumarry.MPPercent;
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;

                isEven = !isEven;
            }

            #endregion body

            #region total

            ++curIndexRow;
            curIndexCol = 1;

            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = "Total";

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.Betslip;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.Win;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.Draw;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.Lose;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            if (summaryDTO.Total.WinPercent < 0)
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
            }
            else
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            }
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.WinPercent;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            if (summaryDTO.Total.TotalStake < 0)
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
            }
            else
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            }
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.TotalStake;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            if (summaryDTO.Total.TotalPL < 0)
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
            }
            else
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            }
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.TotalPL;

            ++curIndexCol;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].SetBorders(
                MultipleBorders.Top | MultipleBorders.Left | MultipleBorders.Right,
                Color.FromArgb(124, 152, 164),
                LineStyle.Thin);
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Weight = ExcelFont.BoldWeight;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Size = 164;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.HorizontalAlignment = HorizontalAlignmentStyle.Right;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
            if (summaryDTO.Total.MPPercent < 0)
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.Red;
            }
            else
            {
                wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.Font.Color = Color.White;
            }
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.FillPattern.SetSolid(Color.FromArgb(59, 89, 152));
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Style.NumberFormat = numberFormat;
            wsReport.Rows[curIndexRow].Cells[curIndexCol].Value = summaryDTO.Total.MPPercent;

            #endregion total

        end:
            return excelFile;
        }

        public DateTimeOption GetDatetimeOption(string dateOption)
        {
            DateTime fromdate, todate;
            switch (dateOption)
            {
                case "0": //default
                case "1": //today
                    fromdate = todate = DateTime.Now;
                    break;
                case "2": //Yesterday
                    fromdate = DateTime.Now.AddDays(-1);
                    todate = DateTime.Now.AddDays(-1);
                    break;
                case "3": //current week
                    fromdate = DateTime.Now.AddDays(-1 * Convert.ToInt32(DateTime.Now.DayOfWeek));
                    todate = DateTime.Now;
                    break;
                case "4": //last week
                    fromdate = DateTime.Now.AddDays(-1 * Convert.ToInt32(DateTime.Now.DayOfWeek) - 7);
                    todate = fromdate.AddDays(6);
                    break;
                case "5": //Current Month
                    fromdate = DateTime.Now.AddDays(-1 * (DateTime.Now.Day - 1));
                    todate = DateTime.Now;
                    break;
                case "6": //Last Month
                    fromdate = DateTime.Now.AddDays(-1 * (DateTime.Now.Day - 1)).AddMonths(-1);
                    todate = DateTime.Now.AddDays(-1 * (DateTime.Now.Day));
                    break;
                case "7": //Since Last Month
                    fromdate = DateTime.Now.AddDays(-1 * (DateTime.Now.Day - 1)).AddMonths(-1);
                    todate = DateTime.Now;
                    break;

                default:
                    fromdate = todate = DateTime.Now;
                    break;
            }
            var dto = new DateTimeOption();
            dto.fdate = fromdate.ToShortDateString();
            dto.tdate = todate.ToShortDateString();
            return dto;
        }

        public SummaryDTO GetSumaryDetailAcc(string fromDate, string toDate, int custId, string acc, int bettype)
        {
            SummaryDTO result = this._summaryReportDataAccess.GetSumaryDetailAcc(
                DateTime.Parse(fromDate), DateTime.Parse(toDate), custId, acc, ReportHelper.MoveBetDay, bettype, ReportHelper.BalanceUpDay);
            if (HttpContext.Current.Session["SUMMARY_REPORT_LEAGUE"] == null)
            {
                HttpContext.Current.Session.Add("SUMMARY_REPORT_LEAGUE", result);
            }
            else
            {
                HttpContext.Current.Session["SUMMARY_REPORT_LEAGUE"] = result;
            }
            return result;
        }

        public LeagueDetailDTO GetSumaryDetailLeague(string fromDate, string toDate, string custIds, string leagueIds, int bettype)
        {
            LeagueDetailDTO result = this._summaryReportDataAccess.GetSumaryDetailLeague(
                DateTime.Parse(fromDate),
                DateTime.Parse(toDate),
                custIds,
                leagueIds,
                ReportHelper.MoveBetDay,
                ReportHelper.BalanceUpDay, bettype);
            if (HttpContext.Current.Session["SUMMARY_REPORT_LEAGUE_DETAIL"] == null)
            {
                HttpContext.Current.Session.Add("SUMMARY_REPORT_LEAGUE_DETAIL", result);
            }
            else
            {
                HttpContext.Current.Session["SUMMARY_REPORT_LEAGUE_DETAIL"] = result;
            }

            return result;
        }

        public SummaryDTO GetSummary(string fromDate, string toDate, string custIds, int bettype)
        {
            //get admin id
            int adminId = CastAide.AsInt32(HttpContext.Current.Session[SessionKey.UserId], 0);
            SummaryDTO result = this._summaryReportDataAccess.GetSummary(
                adminId, DateTime.Parse(fromDate), DateTime.Parse(toDate), custIds, ReportHelper.MoveBetDay, bettype, ReportHelper.BalanceUpDay);
            if (HttpContext.Current.Session["SUMMARY_REPORT_MAIN"] == null)
            {
                HttpContext.Current.Session.Add("SUMMARY_REPORT_MAIN", result);
            }
            else
            {
                HttpContext.Current.Session["SUMMARY_REPORT_MAIN"] = result;
            }
            return result;
        }


        #endregion Public Methods and Operators
    }
}